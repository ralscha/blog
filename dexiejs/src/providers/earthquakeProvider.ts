import {Filter} from "../filter";
import geolib from 'geolib';
import Papa from 'papaparse';
import {Earthquake, EarthquakeDb} from "./earthquakeDb";

export class EarthquakeProvider {

  private static readonly FOURTYFIVE_MINUTES = 30 * 60 * 1000;
  private static readonly ONE_HOUR = 60 * 60 * 1000;
  private static readonly ONE_DAY = 24 * 60 * 60 * 1000;
  private static readonly SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  private static readonly THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  private db: EarthquakeDb;

  constructor() {
    this.db = new EarthquakeDb();
  }

  async initProvider(): Promise<void> {
    if (!navigator.onLine) {
      return;
    }

    const lastUpdate = localStorage.getItem('lastUpdate');
    if (lastUpdate) {
      const lastUpdateTs = parseInt(lastUpdate);
      const now = Date.now();
      if (lastUpdateTs + EarthquakeProvider.SEVEN_DAYS < now) {
        // database older than 7 days. load the 30 days file
        await this.loadData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv');
      }
      else if (lastUpdateTs + EarthquakeProvider.ONE_DAY < now) {
        // database older than 1 day. load the 7 days file
        await this.loadData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.csv');
      }
      else if (lastUpdateTs + EarthquakeProvider.ONE_HOUR < now) {
        // database older than 1 hour. load the 1 day file
        await this.loadData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv');
      }
      else if (lastUpdateTs + EarthquakeProvider.FOURTYFIVE_MINUTES < now) {
        // database older than 45 minutes. load the 1 hour file
        await this.loadData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.csv');
      }
    }
    else {
      //no last update. load the 30 days file
      await this.loadData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv');
    }

    this.deleteOldRecords();
  }

  private async loadData(dataUrl) {
    const response = await fetch(dataUrl);
    const text = await response.text();
    const data = Papa.parse(text, {header: true});

    const earthquakes: Earthquake[] = [];

    for (let row of data.data) {
      if (row.id) {
        earthquakes.push({
          time: new Date(row.time).getTime(),
          place: row.place,
          mag: Number(row.mag),
          depth: Number(row.depth),
          latLng: [Number(row.latitude), Number(row.longitude)],
          id: row.id
        });
      }
    }

    this.db.transaction('rw', this.db.earthquakes, () => {
      this.db.earthquakes.bulkPut(earthquakes);
      localStorage.setItem('lastUpdate', Date.now().toString());
    });

  }

  private deleteOldRecords() {
    const thirtyDaysAgo = Date.now() - EarthquakeProvider.THIRTY_DAYS;
    this.db.earthquakes.where("time").below(thirtyDaysAgo).delete();
  }


  async filter(filter: Filter): Promise<Earthquake[]> {
    const hasMagFilter = !(filter.mag.lower === -1 && filter.mag.upper === 10);
    const hasDistanceFilter = !(filter.distance.lower === 0 && filter.distance.upper === 20000);
    const hasTimeFilter = filter.time !== -1;
    const now = new Date();

    let result: Earthquake[];

    if (hasMagFilter && !hasTimeFilter) {
      result = await this.db.earthquakes.where('mag').between(filter.mag.lower, filter.mag.upper, true, true).toArray();
    }
    else if (!hasMagFilter && hasTimeFilter) {
      now.setHours(now.getHours() - filter.time);
      result = await this.db.earthquakes.where('time').aboveOrEqual(now.getTime()).toArray();
    }
    else if (hasMagFilter && hasTimeFilter) {
      now.setHours(now.getHours() - filter.time);
      /*
      result = await this.db.earthquakes.where('time').aboveOrEqual(now.getTime())
        .and(e => e.mag >= filter.mag.lower && e.mag <= filter.mag.upper).toArray();
      */
      result = await this.db.earthquakes.where('time').aboveOrEqual(now.getTime()).toArray();
      result = result.filter(e => e.mag >= filter.mag.lower && e.mag <= filter.mag.upper);
    }
    else {
      result = await this.db.earthquakes.toArray();
    }

    let filtered: Earthquake[] = [];

    if (hasDistanceFilter || filter.sort === 'distance') {
      result.forEach(r => {
        const distanceInKilometers = geolib.getDistance(
          {latitude: r.latLng[0], longitude: r.latLng[1]},
          {latitude: filter.myLocation.latitude, longitude: filter.myLocation.longitude}) / 1000;

        if (hasDistanceFilter) {
          if (filter.distance.lower <= distanceInKilometers && distanceInKilometers <= filter.distance.upper) {
            r.distance = distanceInKilometers;
            filtered.push(r);
          }
        }
        else {
          r.distance = distanceInKilometers;
          filtered.push(r);
        }
      });
    }
    else {
      filtered = result;
    }


    if (filter.sort === 'mag') {
      return filtered.sort((a, b) => b.mag - a.mag);
    }

    if (filter.sort === 'distance') {
      return filtered.sort((a, b) => a.distance - b.distance);
    }

    return filtered.sort((a, b) => b.time - a.time);
  }
}
