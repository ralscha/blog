import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {HomePage} from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {AuthService} from "../providers/auth-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = null;

  constructor(platform: Platform,
              private readonly authService: AuthService) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this.authService.authUser.subscribe(jwt => {
      if (jwt) {
        this.rootPage = HomePage;
      }
      else {
        this.rootPage = LoginPage;
      }
    });

    this.authService.checkLogin();
  }
}
