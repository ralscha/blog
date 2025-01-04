import {Component, Input} from '@angular/core';
import * as geolib from 'geolib';
import {Earthquake} from '../earthquake';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    standalone: false
})
export class DetailComponent {

  @Input()
  earthquake!: Earthquake;

  @Input()
  referenceLocation!: {
    latitude: number;
    longitude: number
  };

  distanceToReference(earthquake: Earthquake): number | null {
    if (earthquake.distance) {
      return earthquake.distance;
    }

    const latLng = earthquake.latLng;
    if (latLng) {
      return geolib.getDistance({
        latitude: this.referenceLocation.latitude,
        longitude: this.referenceLocation.longitude
      }, {
        latitude: latLng[0],
        longitude: latLng[1]
      }) / 1000;
    }
    return null;
  }
}
