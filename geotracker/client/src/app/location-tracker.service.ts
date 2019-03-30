import {ApplicationRef, Injectable} from '@angular/core';
import {ServerPushService} from './server-push.service';
import {AppPosition} from './app-position';

declare var BackgroundGeolocation: any;

@Injectable({
  providedIn: 'root'
})
export class LocationTrackerService {

  pos: AppPosition = null;

  constructor(private serverPush: ServerPushService,
              private readonly appRef: ApplicationRef) {
  }

  startTracking(): void {
    this.getForegroundLocation();
    this.startBackgroundLocation();
  }

  stopTracking(): void {
    BackgroundGeolocation.stop();
  }

  getForegroundLocation(): void {
    const geoOptions = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 10000
    };

    navigator.geolocation.getCurrentPosition(loc => {
      this.pos = {
        accuracy: loc.coords.accuracy,
        bearing: loc.coords.heading,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        speed: loc.coords.speed,
        time: loc.timestamp
      };
      this.serverPush.pushPosition(this.pos);
    }, err => this.serverPush.pushError(err.message), geoOptions);
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
          this.pos = {
            accuracy: location.accuracy,
            bearing: location.bearing,
            latitude: location.latitude,
            longitude: location.longitude,
            speed: location.speed,
            time: location.time
          };
          this.serverPush.pushPosition(this.pos);
          this.appRef.tick();
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
