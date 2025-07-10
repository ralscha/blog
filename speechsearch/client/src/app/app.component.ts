import {Component, inject} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {IonApp, IonRouterOutlet} from "@ionic/angular/standalone";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    IonRouterOutlet,
    IonApp
  ]
})
export class AppComponent {
  private platform = inject(Platform);
  private splashScreen = inject(SplashScreen);
  private statusBar = inject(StatusBar);

  constructor() {
    this.initializeApp();
  }

  initializeApp(): void {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
