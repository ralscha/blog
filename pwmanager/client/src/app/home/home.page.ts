import {Component} from '@angular/core';
import {NavController} from '@ionic/angular';
import {PasswordService} from '../password.service';
import {Password} from '../password';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  passwords: Password[] = [];

  constructor(private readonly navCtrl: NavController,
              private readonly passwordService: PasswordService) {
  }

  ionViewDidEnter() {
    this.passwords = this.passwordService.getPasswords();
  }

  filter(event) {
    const query = event.target.value;
    if (query !== undefined) {
      this.passwords = this.passwordService.getPasswords().filter(pw => (pw.url.includes(query)
        || (pw.description && pw.description.includes(query))));
    } else {
      this.passwords = this.passwordService.getPasswords();
    }
  }

  addPassword() {
    this.navCtrl.navigateForward(['edit']);
  }

  editPassword(password: Password) {
    this.navCtrl.navigateForward(['edit', password.id]);
  }

  logout() {
    this.passwordService.clearPasswords();
    this.navCtrl.navigateRoot(['login'], {replaceUrl: true});
  }
}
