import {Component} from '@angular/core';
import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

declare var codePush: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      const deploymentKey = 'Z_F0kSey7z0lrIWRr7rjobgU0qwnSJ8SY5DJV';
      codePush.sync(null, {deploymentKey});

      this.platform.resume.subscribe(() => codePush.sync(null, {deploymentKey}));

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
