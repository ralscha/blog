import {Injectable} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation';
import {
  BackgroundGeolocation, BackgroundGeolocationConfig,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/catch';
import {EmptyObservable} from "rxjs/observable/EmptyObservable";
import {ServerPushProvider} from "../server-push/server-push";

@Injectable()
export class LocationTrackerProvider {

  constructor(private serverPush: ServerPushProvider,
              private geolocation: Geolocation,
              private backgroundGeolocation: BackgroundGeolocation) {
  }

  startTracking(): void {
    this.getForegroundLocation();
    this.startBackgroundLocation();
  }

  stopTracking(): void {
    this.backgroundGeolocation.stop();
  }

  getForegroundLocation(): void {
    this.geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000
    }).then(loc => {
      this.serverPush.pushPosition({
        accuracy: loc.coords.accuracy,
        bearing: loc.coords.heading,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        speed: loc.coords.speed,
        time: loc.timestamp
      });
    });
  }

  startBackgroundLocation(): void {
    const backgroundOptions: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      stopOnTerminate: false,
      debug: false,
      notificationTitle: 'geotracker',
      notificationText: 'Demonstrate background geolocation',
      activityType: 'AutomotiveNavigation',
      locationProvider: this.backgroundGeolocation.LocationProvider.ANDROID_ACTIVITY_PROVIDER,
      interval: 90000,
      fastestInterval: 60000,
      activitiesInterval: 80000
    };

    this.backgroundGeolocation.configure(backgroundOptions)
      .catch(error => {
        this.serverPush.pushError(error);
        return new EmptyObservable();
      })
      .subscribe((location: BackgroundGeolocationResponse) => {
        if (location) {
          this.serverPush.pushPosition({
            accuracy: location.accuracy,
            bearing: location.bearing,
            latitude: location.latitude,
            longitude: location.longitude,
            speed: location.speed,
            time: location.time
          });
        }
        this.backgroundGeolocation.finish();
      });

    this.backgroundGeolocation.start();
  }

}
