import {Injectable} from '@angular/core';
import {Filter} from './filter-interface';
import {parse} from 'papaparse';
import * as geolib from 'geolib';
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {Earthquake} from './earthquake';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable({
  providedIn: 'root'
})
export class EarthquakeService {

  private static readonly FOURTYFIVE_MINUTES = 30 * 60 * 1000;
  private static readonly ONE_HOUR = 60 * 60 * 1000;
  private static readonly ONE_DAY = 24 * 60 * 60 * 1000;
  private static readonly SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  private static readonly THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  private db!: IDBDatabase;

  constructor(private readonly http: HttpClient) {
  }

  initProvider(): Promise<void> {
    let promise = this.initDb();

    if (!navigator.onLine) {
      return promise;
    }

    const lastUpdate = localStorage.getItem('lastUpdate');
    if (lastUpdate) {
      const lastUpdateTs = parseInt(lastUpdate, 10);
      const now = Date.now();
      if (lastUpdateTs + EarthquakeService.SEVEN_DAYS < now) {
        // database older than 7 days. load the 30 days file
        promise = promise.then(() => this.loadData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv'));
      } else if (lastUpdateTs + EarthquakeService.ONE_DAY < now) {
        // database older than 1 day. load the 7 days file
        promise = promise.then(() => this.loadData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.csv'));
      } else if (lastUpdateTs + EarthquakeService.ONE_HOUR < now) {
        // database older than 1 hour. load the 1 day file
        promise = promise.then(() => this.loadData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv'));
      } else if (lastUpdateTs + EarthquakeService.FOURTYFIVE_MINUTES < now) {
        // database older than 45 minutes. load the 1 hour file
        promise = promise.then(() => this.loadData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.csv'));
      }
    } else {
      // no last update. load the 30 days file
      promise = promise.then(() => this.loadData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv'));
    }

    return promise.then(() => this.deleteOldRecords());
  }

  filter(filter: Filter): Promise<Earthquake[]> {
    const tx = this.db.transaction('earthquakes', 'readonly');
    const store = tx.objectStore('earthquakes');
    const magIndex: IDBIndex = store.index('mag');
    const timeIndex: IDBIndex = store.index('time');

    const hasMagFilter = !(filter.mag.lower === -1 && filter.mag.upper === 10);
    const hasDistanceFilter = !(filter.distance.lower === 0 && filter.distance.upper === 20000);
    const hasTimeFilter = filter.time !== '-1';

    let promise = new Promise<Earthquake[]>(resolve => {
      if (hasMagFilter && !hasTimeFilter) {
        magIndex.getAll(IDBKeyRange.bound(filter.mag.lower, filter.mag.upper))
          .onsuccess = e => resolve((e.target as any).result);
      } else if (!hasMagFilter && hasTimeFilter) {
        const now = new Date();
        now.setHours(now.getHours() - parseInt(filter.time, 10));
        timeIndex.getAll(IDBKeyRange.lowerBound(now.getTime()))
          .onsuccess = e => resolve((e.target as any).result);
      } else if (hasMagFilter && hasTimeFilter) {
        const magPromise = new Promise<string[]>(res => {
          magIndex.getAllKeys(IDBKeyRange.bound(filter.mag.lower, filter.mag.upper))
            .onsuccess = e => res((e.target as any).result);
        });

        const now = new Date();
        now.setHours(now.getHours() - parseInt(filter.time, 10));
        const timePromise = new Promise<string[]>(res => {
          timeIndex.getAllKeys(IDBKeyRange.lowerBound(now.getTime()))
            .onsuccess = e => res((e.target as any).result);
        });

        Promise.all([magPromise, timePromise]).then(results => {
          const intersection = results[0].filter(id => results[1].includes(id));
          const result: Earthquake[] = [];
          intersection.forEach(id => {
            store.get(id).onsuccess = e => result.push((e.target as any).result);
          });
          tx.oncomplete = () => resolve(result);
        });
      } else {
        magIndex.getAll()
          .onsuccess = e => resolve((e.target as any).result);
      }
    });

    if (hasDistanceFilter || filter.sort === 'distance') {
      promise = promise.then(e => {
        const filtered: Earthquake[] = [];
        e.forEach(r => {

          const distanceInKilometers = geolib.getDistance(
            {latitude: r.latLng[0], longitude: r.latLng[1]},
            {latitude: filter.myLocation.latitude, longitude: filter.myLocation.longitude}) / 1000;

          if (hasDistanceFilter) {
            if (filter.distance.lower <= distanceInKilometers && distanceInKilometers <= filter.distance.upper) {
              r.distance = distanceInKilometers;
              filtered.push(r);
            }
          } else {
            r.distance = distanceInKilometers;
            filtered.push(r);
          }

        });

        return filtered;
      });
    }


    if (filter.sort === 'mag') {
      return promise.then(e => e.sort((a, b) => b.mag - a.mag));
    }

    if (filter.sort === 'distance') {
      return promise.then(e => e.sort((a, b) => {
        if (a.distance && b.distance) {
          return a.distance - b.distance;
        } else if (!a.distance && b.distance) {
          return -1;
        } else if (a.distance && !b.distance) {
          return 1;
        } else {
          return 0;
        }
      }));
    }

    return promise.then(e => e.sort((a, b) => b.time - a.time));
  }

  private initDb(): Promise<void> {
    if (this.db) {
      this.db.close();
    }

    return new Promise(resolve => {
      const openRequest = indexedDB.open('Earthquake', 1);

      openRequest.onupgradeneeded = event => {
        const target: EventTarget | null = event.target;
        const db = (target as any).result;
        const store = db.createObjectStore('earthquakes', {keyPath: 'id'});
        store.createIndex('mag', 'mag');
        store.createIndex('time', 'time');
      };

      openRequest.onsuccess = event => {
        this.db = (event.target as any).result;

        this.db.onerror = e => {
          console.log(e);
        };

        resolve();
      };
    });
  }

  private loadData(dataUrl: string): Promise<void> {
    return new Promise(resolve => {
      const response = this.http.get(dataUrl, {responseType: 'text'}).pipe(map(data => parse<{
        id: string, time: string, place: string, mag: string,
        depth: string, latitude: string, longitude: string
      }>(data, {header: true})));
      response
        .subscribe(data => {
          const tx = this.db.transaction('earthquakes', 'readwrite');
          const store = tx.objectStore('earthquakes');

          for (const row of data.data) {
            if (row.id) {
              store.put({
                time: new Date(row.time).getTime(),
                place: row.place,
                mag: Number(row.mag),
                depth: Number(row.depth),
                latLng: [Number(row.latitude), Number(row.longitude)],
                id: row.id
              });
            }
          }

          tx.oncomplete = () => {
            localStorage.setItem('lastUpdate', Date.now().toString());
            resolve();
          };
        });
    });
  }

  private deleteOldRecords(): Promise<void> {
    const tx = this.db.transaction('earthquakes', 'readwrite');
    const store = tx.objectStore('earthquakes');
    const timeIndex: IDBIndex = store.index('time');
    const thirtyDaysAgo = Date.now() - EarthquakeService.THIRTY_DAYS;

    return new Promise(resolve => {
      timeIndex.openCursor(IDBKeyRange.upperBound(thirtyDaysAgo)).onsuccess = event => {
        const cursor = (event.target as any).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      tx.oncomplete = () => resolve();
    });
  }
}
