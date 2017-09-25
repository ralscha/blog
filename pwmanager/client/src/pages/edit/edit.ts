import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PasswordProvider} from "../../providers/password/password";
import {Password} from "../../../password";
import {v4} from "uuid";

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html'
})
export class EditPage {
  password: Password;

  constructor(private readonly navCtrl: NavController,
              private readonly navParams: NavParams,
              private readonly passwordProvider: PasswordProvider) {
    this.password = {
      id: null,
      url: '',
      username: '',
      password: '',
      description: ''
    };
  }

  ionViewDidLoad() {
    let password = this.navParams.get('password');
    if (password) {
      this.password = password;
    }
  }

  save() {
    if (!this.password.id) {
      this.password.id = v4();
    }
    this.passwordProvider.savePassword(this.password);
    this.navCtrl.pop();
  }

  deletePassword() {
    if (this.password.id) {
      this.passwordProvider.deletePassword(this.password);
      this.navCtrl.pop();
    }
  }
}
