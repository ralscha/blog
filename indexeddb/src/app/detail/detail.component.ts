import {Component, input} from '@angular/core';
import getDistance from 'geolib/es/getDistance';
import {Earthquake} from '../earthquake';
import {DatePipe, DecimalPipe} from '@angular/common';
import {IonCol, IonRow} from "@ionic/angular/standalone";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
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
