import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {PasswordProvider} from "../../providers/password/password";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(private readonly navCtrl: NavController,
              private readonly passwordProvider: PasswordProvider) {
  }

  async login(username: string, password: string) {
    await this.passwordProvider.fetchPasswords(username, password);
    this.navCtrl.setRoot(HomePage);
  }

}
