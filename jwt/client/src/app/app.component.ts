import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {AuthProvider} from "../providers/auth/auth";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = null;

  constructor(private readonly platform: Platform,
              private readonly statusBar: StatusBar,
              private readonly splashScreen: SplashScreen,
              private readonly authProvider: AuthProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.authProvider.authUser.subscribe(jwt => {
      if (jwt) {
        this.rootPage = HomePage;
      }
      else {
        this.rootPage = LoginPage;
      }
    });

    this.authProvider.checkLogin();
  }
}
