import {Component} from '@angular/core';
import {ServerPushService} from '../server-push.service';
import {LocationTrackerService} from '../location-tracker.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {

  tracking: boolean;

  constructor(public readonly locationTracker: LocationTrackerService,
              private readonly serverPush: ServerPushService) {
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
