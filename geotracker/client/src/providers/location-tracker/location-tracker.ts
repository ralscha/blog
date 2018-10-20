import {Injectable} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation';
import {catchError} from 'rxjs/operators';
import {EmptyObservable} from "rxjs/observable/EmptyObservable";
import {ServerPushProvider} from "../server-push/server-push";

declare var BackgroundGeolocation: any;

@Injectable()
export class LocationTrackerProvider {

  constructor(private serverPush: ServerPushProvider,
              private geolocation: Geolocation) {
  }

  startTracking(): void {
    this.getForegroundLocation();
    this.startBackgroundLocation();
  }

  stopTracking(): void {
    BackgroundGeolocation.stop();
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
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 20,
      distanceFilter: 30,
      stopOnTerminate: false,
      debug: false,
      notificationTitle: 'geotracker',
      notificationText: 'Demonstrate background geolocation',
      activityType: 'AutomotiveNavigation',
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 90000,
      fastestInterval: 60000,
      activitiesInterval: 80000
    });

    BackgroundGeolocation.on('location', location => {
      BackgroundGeolocation.startTask(taskKey => {
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
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', stationaryLocation => {
      // handle stationary locations here
    });

    BackgroundGeolocation.on('error', error => this.serverPush.pushError(error));

    BackgroundGeolocation.checkStatus(status => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      if (!status.isRunning) {
        BackgroundGeolocation.start();
      }
    });
  }
}
