import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EditPage} from "../edit/edit";
import {PasswordProvider} from "../../providers/password/password";
import {Password} from "../../../password";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  passwords: Password[] = [];

  constructor(private readonly navCtrl: NavController,
              private readonly passwordProvider: PasswordProvider) {
  }

  ionViewWillEnter() {
    this.passwords = this.passwordProvider.getPasswords();
  }

  filter(event) {
    const query = event.target.value;
    if (query !== undefined) {
      this.passwords = this.passwordProvider.getPasswords().filter(pw => (pw.url.includes(query)
        || (pw.description && pw.description.includes(query))));
    }
    else {
      this.passwords = this.passwordProvider.getPasswords();
    }
  }

  addPassword() {
    this.navCtrl.push(EditPage);
  }

  editPassword(password: Password) {
    this.navCtrl.push(EditPage, {
      password: password
    });
  }

  logout() {
    this.passwordProvider.clearPasswords();
    this.navCtrl.setRoot(LoginPage);
  }
}
