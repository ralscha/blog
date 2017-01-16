import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {HomePage} from '../pages/home/home';
//import {Observable} from "rxjs";
declare var codePush: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
      // codePush.sync();
    });

    platform.resume.subscribe(() => codePush.sync(null, {deploymentKey: 'b5s7XEMEPVsDhP54yK7_BHulXFg2V16RCXmIG'}));

    // const source = Observable.timer(5000, 1000*60*60);
    // const subscription = source.subscribe(() => codePush.sync());
  }
}
