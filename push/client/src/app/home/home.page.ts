import {ChangeDetectorRef, Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {timeout} from 'rxjs/operators';
import {environment} from '../../environments/environment';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare let cordova: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {

  allowPush: boolean;
  allowPersonal: boolean;
  items: { id: number, text: string }[] = [];
  token: string | null = null;
  private readonly TOPIC_NAME = 'chuck';

  constructor(private readonly http: HttpClient,
              platform: Platform,
              private readonly changeDetectorRef: ChangeDetectorRef) {

    platform.ready().then(async () => {
      try {
        await this.initFcm();
      } catch (e) {
        console.log('Something went wrong during initialization: ', e);
      }
    });

    const pushFlag = localStorage.getItem('allowPush');
    this.allowPush = pushFlag != null ? JSON.parse(pushFlag) : false;

    const personalFlag = localStorage.getItem('allowPersonal');
    this.allowPersonal = personalFlag != null ? JSON.parse(personalFlag) : false;
  }

  async initFcm(): Promise<void> {
    await cordova.plugins.firebase.messaging.requestPermission();
    this.token = await cordova.plugins.firebase.messaging.getToken();

    cordova.plugins.firebase.messaging.onTokenRefresh(async () => {
      console.log('Token updated');
      this.token = await cordova.plugins.firebase.messaging.getToken();
    });

    cordova.plugins.firebase.messaging.onMessage((payload: any) => {
      console.log('New foreground message: ', payload);
      this.handleNotification(payload);
    });

    cordova.plugins.firebase.messaging.onBackgroundMessage((payload: any) => {
      console.log('New background message: ', payload);
      this.handleNotification(payload);
    });

    this.onChange();
    this.onPmChange();
  }

  register(): void {
    if (this.token !== null) {
      const formData = new FormData();
      formData.append('token', this.token);
      this.http.post(`${environment.serverURL}/register`, formData)
        .pipe(timeout(10000))
        .subscribe(() => localStorage.setItem('allowPersonal', JSON.stringify(this.allowPersonal)),
          () => this.allowPersonal = !this.allowPersonal);
    }
  }

  unregister(): void {
    if (this.token !== null) {
      const formData = new FormData();
      formData.append('token', this.token);
      this.http.post(`${environment.serverURL}/unregister`, formData)
        .pipe(timeout(10000))
        .subscribe(() => localStorage.setItem('allowPersonal', JSON.stringify(this.allowPersonal)),
          () => this.allowPersonal = !this.allowPersonal);
    }
  }

  onChange(): void {
    localStorage.setItem('allowPush', JSON.stringify(this.allowPush));

    if (this.allowPush) {
      cordova.plugins.firebase.messaging.subscribe(this.TOPIC_NAME);
    } else {
      cordova.plugins.firebase.messaging.unsubscribe(this.TOPIC_NAME);
    }
  }

  onPmChange(): void {
    if (this.allowPersonal) {
      this.register();
    } else {
      this.unregister();
    }
  }

  handleNotification(data: any): void {
    if (!data.text) {
      return;
    }

    this.items.splice(0, 0, {id: data.id, text: data.text});

    // only keep the last 5 entries
    if (this.items.length > 5) {
      this.items.pop();
    }

    this.changeDetectorRef.detectChanges();
  }

}
