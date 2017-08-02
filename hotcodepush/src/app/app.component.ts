import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from '../pages/home/home';

declare var chcp: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    //manual mode. remove this for automatic mode
    platform.resume.subscribe(() => this.fetchUpdate());
  }

  fetchUpdate() {
    const options = {
      'config-file': 'https://static.rasc.ch/hcp/chcp.json'
    };
    chcp.fetchUpdate(this.updateCallback, options);
  }

  updateCallback(error, data) {
    if (error) {
      console.log('Failed to load the update with error code: ' + error.code);
      console.log(error.description);
    } else {
      console.log('Update is loaded');

      chcp.installUpdate(error => {
        if (error) {
          console.log('Failed to install the update with error code: ' + error.code);
          console.log(error.description);
        } else {
          console.log('Update installed!');
        }
      });
    }
  }

}
