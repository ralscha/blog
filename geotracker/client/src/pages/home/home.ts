import {Component} from '@angular/core';
import {LocationTrackerProvider} from "../../providers/location-tracker/location-tracker";
import {ServerPushProvider} from "../../providers/server-push/server-push";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tracking: boolean;

  constructor(private locationTracker: LocationTrackerProvider,
              private serverPush: ServerPushProvider) {
    this.tracking = false;
  }

  start(): void {
    this.tracking = true;
    this.locationTracker.startTracking();
  }

  stop(): void {
    this.locationTracker.stopTracking();
    this.tracking = false;
  }

  clear(): void {
    this.serverPush.clear();
  }
}
