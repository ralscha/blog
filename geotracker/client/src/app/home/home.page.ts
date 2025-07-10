import {Component, inject} from '@angular/core';
import {ServerPushService} from '../server-push.service';
import {LocationTrackerService} from '../location-tracker.service';
import {DatePipe} from '@angular/common';
import {IonButton, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  imports: [DatePipe, IonHeader, IonToolbar, IonTitle, IonContent, IonButton]
})
export class HomePage {
  readonly locationTracker = inject(LocationTrackerService);
  tracking: boolean;
  private readonly serverPush = inject(ServerPushService);

  constructor() {
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
