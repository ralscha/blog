import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {LoginPage} from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform) {
  }
}

