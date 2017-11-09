/// <reference types="node" />

import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators/map';
import {catchError} from 'rxjs/operators/catchError';
import {SERVER_URL} from '../config';
import {Observable} from "rxjs";
import {load} from "protobufjs";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class EarthquakeProvider {
  private Earthquakes: any;

  constructor(private readonly http: HttpClient) {
    load("assets/Earthquake.proto", (err, root) => {
      if (err) {
        throw err;
      }
      this.Earthquakes = root.lookup("Earthquakes");
    });
  }

  refresh(): Observable<void> {
    return this.http.get<void>(SERVER_URL + "/refresh");
  }

  fetchJson(): Observable<Earthquake[]> {
    return this.http.get(SERVER_URL + "/earthquakes.json")
      .pipe(catchError(e => this.handleError(e)));
  }

  fetchProtobuf(): Observable<Earthquake[]> {
    return this.http.get(SERVER_URL + "/earthquakes.protobuf", {responseType: 'arraybuffer'})
      .pipe(map(res => this.parseProtobuf(res)),
        catchError(this.handleError)
      );
  }

  parseProtobuf(response: ArrayBuffer): Earthquake[] {
    console.time('decodeprotobuf');
    const message = this.Earthquakes.decode(new Uint8Array(response));
    console.timeEnd('decodeprotobuf');
    return message.earthquakes;
  }

  handleError(error): Observable<any> {
    console.error(error);
    return Observable.throw(error || 'Server error');
  }

}

export interface Earthquake {
  id: string,
  time: string,
  latitude: number,
  longitude: number,
  depth: number,
  mag?: number,
  place: string,
  magType?: string
}
