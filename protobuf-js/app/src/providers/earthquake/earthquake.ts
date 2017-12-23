import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators/map';
import {catchError} from 'rxjs/operators/catchError';
import {ENV} from '@app/env';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Earthquakes, IEarthquake} from "../../protos/earthquake";

@Injectable()
export class EarthquakeProvider {
  constructor(private readonly http: HttpClient) {
  }

  refresh(): Observable<void> {
    return this.http.get<void>(`${ENV.SERVER_URL}/refresh`);
  }

  fetchJson(): Observable<IEarthquake[]> {
    return this.http.get<any>(`${ENV.SERVER_URL}/earthquakes`)
      .pipe(map(res => res.earthquakes), catchError(e => this.handleError(e)));
  }

  fetchProtobuf(): Observable<IEarthquake[]> {
    const headers = new HttpHeaders({'Accept': 'application/x-protobuf'});
    return this.http.get(`${ENV.SERVER_URL}/earthquakes`, {headers, responseType: 'arraybuffer'})
      .pipe(map(res => this.parseProtobuf(res)),
        catchError(this.handleError)
      );
  }

  parseProtobuf(response: ArrayBuffer): IEarthquake[] {
    console.time('decodeprotobuf');
    const earthquakes = Earthquakes.decode(new Uint8Array(response))
    console.timeEnd('decodeprotobuf');
    return earthquakes.earthquakes;
  }

  handleError(error): Observable<any> {
    console.error(error);
    return Observable.throw(error || 'Server error');
  }

}

