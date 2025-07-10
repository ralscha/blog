import {Component, input} from '@angular/core';
import {Earthquake} from '../earthquake-db';
import {DatePipe, DecimalPipe} from '@angular/common';
import {IonCol, IonRow} from "@ionic/angular/standalone";
import getDistance from 'geolib/es/getDistance';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styles: ['.magnitude { font-weight: bold; font-size: 1.3em; }'],
  imports: [DecimalPipe, DatePipe, IonRow, IonCol]
})
export class DetailComponent {

  readonly earthquake = input.required<Earthquake>();

  readonly referenceLocation = input.required<{
    latitude: number;
    longitude: number;
  }>();

  distanceToReference(earthquake: Earthquake): number | null {
    if (earthquake.distance) {
      return earthquake.distance;
    }

    const latLng = earthquake.latLng;
    if (latLng) {
      return getDistance({
        latitude: this.referenceLocation().latitude,
        longitude: this.referenceLocation().longitude
      }, {
        latitude: latLng[0],
        longitude: latLng[1]
      }) / 1000;
    }
    return null;
  }
}
