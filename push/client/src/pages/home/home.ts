import {Component, NgZone} from '@angular/core';
import {Http} from "@angular/http";
import {Platform} from "ionic-angular";
import {Storage} from "@ionic/storage";
import 'rxjs/add/operator/timeout';
import {Firebase} from "@ionic-native/firebase";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private readonly TOPIC_NAME = "chuck";

  allowPush: boolean;
  allowPersonal: boolean;

  items: { id: number, text: string }[] = [];
  token: string;

  constructor(private readonly http: Http,
              private readonly platform: Platform,
              private readonly ngZone: NgZone,
              private readonly firebase: Firebase,
              private readonly storage: Storage) {

    platform.ready().then(() => {
      this.firebase.onTokenRefresh()
        .subscribe((token: string) => this.token = token);

      this.firebase.onNotificationOpen().subscribe(notification => this.handleNotification(notification));
    });

    storage.get("allowPush").then(flag => this.allowPush = !!flag);
    storage.get("allowPersonal").then(flag => this.allowPersonal = !!flag);
  }

  register() {
    const formData = new FormData();
    formData.append('token', this.token);
    this.http.post(`http://192.168.178.20:8080/register`, formData)
      .timeout(10000)
      .subscribe(() => this.storage.set("allowPersonal", this.allowPersonal),
        error => this.allowPersonal = !this.allowPersonal);
  }

  unregister() {
    const formData = new FormData();
    formData.append('token', this.token);
    this.http.post(`http://192.168.178.20:8080/unregister`, formData)
      .timeout(10000)
      .subscribe(() => this.storage.set("allowPersonal", this.allowPersonal),
        error => this.allowPersonal = !this.allowPersonal);
  }

  onChange() {
    this.storage.set("allowPush", this.allowPush);

    if (this.allowPush) {
      this.firebase.subscribe(this.TOPIC_NAME);
    }
    else {
      this.firebase.unsubscribe(this.TOPIC_NAME);
    }
  }

  onPmChange() {
    if (this.allowPersonal) {
      this.register();
    }
    else {
      this.unregister();
    }
  }

  handleNotification(data) {
    if (!data.text) {
      return;
    }

    this.ngZone.run(() => {
      this.items.splice(0, 0, {id: data.id, text: data.text});

      //only keep the last 5 entries
      if (this.items.length > 5) {
        this.items.pop();
      }

    });
  }

}
