import {Component, Input} from '@angular/core';
import {Earthquake} from "../../earthquake";
import geolib from 'geolib';

@Component({
  selector: 'detail',
  templateUrl: 'detail.html'
})
export class DetailComponent {

  @Input()
  earthquake: Earthquake;

  @Input()
  referenceLocation: {
    latitude: number;
    longitude: number
  };

  distanceToReference(earthquake: Earthquake) {
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
