/// <reference types="node" />

import {Injectable} from '@angular/core';
import {Http, Response, ResponseContentType} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SERVER_URL} from '../config';
import {Observable} from "rxjs";
import {load} from "protobufjs";

@Injectable()
export class EarthquakeProvider {
  private Earthquakes: any;

  constructor(private readonly http: Http) {
    load("assets/Earthquake.proto", (err, root) => {
      if (err) {
        throw err;
      }
      this.Earthquakes = root.lookup("Earthquakes");
    });
  }

  refresh(): Observable<boolean> {
    return this.http.get(SERVER_URL + "/refresh").map(res => res.ok);
  }

  fetchJson(): Observable<Earthquake[]> {
    return this.http.get(SERVER_URL + "/earthquakes.json")
      .map(res => {
        console.time('decodejson');
        const json = res.json();
        console.timeEnd('decodejson');
        return json;
      })
      .catch(this.handleError);
  }

  fetchProtobuf(): Observable<Earthquake[]> {
    return this.http.get(SERVER_URL + "/earthquakes.protobuf", {responseType: ResponseContentType.ArrayBuffer})
      .map(res => this.parseProtobuf(res))
      .catch(this.handleError);
  }

  parseProtobuf(response: Response): Earthquake[] {
    console.time('decodeprotobuf');
    const message = this.Earthquakes.decode(new Uint8Array(response.arrayBuffer()));
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
