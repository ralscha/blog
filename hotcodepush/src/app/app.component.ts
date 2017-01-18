import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {HomePage} from '../pages/home/home';

declare var chcp: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
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
