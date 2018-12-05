import {ChangeDetectorRef, Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {timeout} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  allowPush: boolean;
  allowPersonal: boolean;
  items: { id: number, text: string }[] = [];
  token: string;
  private readonly TOPIC_NAME = 'chuck';

  constructor(private readonly http: HttpClient,
              platform: Platform,
              private readonly changeDetectorRef: ChangeDetectorRef) {

    platform.ready().then(() => {
      window['FirebasePlugin'].getToken(token => this.token = token,
                                        error => console.error('Error getting token', error));

      window['FirebasePlugin'].onTokenRefresh(token => this.token = token,
                                        error => console.error('Error token refresh', error));

      window['FirebasePlugin'].onNotificationOpen(notification => this.handleNotification(notification),
                                        error => console.error('Error notification open', error));

    });

    const pushFlag = localStorage.getItem('allowPush');
    this.allowPush = pushFlag != null ? JSON.parse(pushFlag) : false;

    const personalFlag = localStorage.getItem('allowPersonal');
    this.allowPersonal = personalFlag != null ? JSON.parse(personalFlag) : false;
  }

  register() {
    const formData = new FormData();
    formData.append('token', this.token);
    this.http.post(`${environment.serverURL}/register`, formData)
      .pipe(timeout(10000))
      .subscribe(() => localStorage.setItem('allowPersonal', JSON.stringify(this.allowPersonal)),
        error => this.allowPersonal = !this.allowPersonal);
  }

  unregister() {
    const formData = new FormData();
    formData.append('token', this.token);
    this.http.post(`${environment.serverURL}/unregister`, formData)
      .pipe(timeout(10000))
      .subscribe(() => localStorage.setItem('allowPersonal', JSON.stringify(this.allowPersonal)),
        error => this.allowPersonal = !this.allowPersonal);
  }

  onChange() {
    localStorage.setItem('allowPush', JSON.stringify(this.allowPush));

    if (this.allowPush) {
      window['FirebasePlugin'].subscribe(this.TOPIC_NAME);
    } else {
      window['FirebasePlugin'].unsubscribe(this.TOPIC_NAME);
    }
  }

  onPmChange() {
    if (this.allowPersonal) {
      this.register();
    } else {
      this.unregister();
    }
  }

  handleNotification(data) {
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
