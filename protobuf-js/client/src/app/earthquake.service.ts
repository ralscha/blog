import {inject, Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Earthquakes, IEarthquake} from './protos/earthquake';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EarthquakeService {
  private readonly http = inject(HttpClient);


  refresh(): Observable<void> {
    return this.http.get<void>(`${environment.SERVER_URL}/refresh`);
  }

  fetchJson(): Observable<IEarthquake[]> {
    return this.http.get<{ earthquakes: IEarthquake[] }>(`${environment.SERVER_URL}/earthquakes`)
      .pipe(map(res => res.earthquakes), catchError(e => this.handleError(e)));
  }

  fetchProtobuf(): Observable<IEarthquake[]> {
    const headers = new HttpHeaders({Accept: 'application/x-protobuf'});
    return this.http.get(`${environment.SERVER_URL}/earthquakes`, {headers, responseType: 'arraybuffer'})
      .pipe(map(res => this.parseProtobuf(res)),
        catchError(this.handleError)
      );
  }

  parseProtobuf(response: ArrayBuffer): IEarthquake[] {
    // eslint-disable-next-line no-console
    console.time('decodeprotobuf');
    const earthquakes = Earthquakes.decode(new Uint8Array(response));
    // eslint-disable-next-line no-console
    console.timeEnd('decodeprotobuf');
    return earthquakes.earthquakes;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: any): Observable<any> {
    console.error(error);
    return throwError(error || 'Server error');
  }
}
