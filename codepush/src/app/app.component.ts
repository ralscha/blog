import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from '../pages/home/home';
//import {Observable} from "rxjs";
declare var codePush: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      platform.resume.subscribe(() =>
        codePush.sync(null, {deploymentKey: 'cFu_iWwpQVqGH2NuyBVW1ZG5GtIvV16RCXmIG'}));

      // const source = Observable.timer(5000, 1000*60*60);
      // const subscription = source.subscribe(() => codePush.sync());
    });

  }
}
