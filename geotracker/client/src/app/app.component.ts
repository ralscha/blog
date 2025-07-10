import {Component, inject} from '@angular/core';

import {IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet
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
