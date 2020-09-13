import {Component} from '@angular/core';
import {NavController, ViewDidEnter} from '@ionic/angular';
import {PasswordService} from '../password.service';
import {Password} from '../password';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements ViewDidEnter {
  passwords: Password[] = [];

  constructor(private readonly navCtrl: NavController,
              private readonly passwordService: PasswordService) {
  }

  ionViewDidEnter(): void {
    this.passwords = this.passwordService.getPasswords();
  }

  // tslint:disable-next-line:no-any
  filter(event: any): void {
    const query = event.target.value;
    if (query !== undefined) {
      this.passwords = this.passwordService.getPasswords().filter(pw => (pw.url.includes(query)
        || (pw.description && pw.description.includes(query))));
    } else {
      this.passwords = this.passwordService.getPasswords();
    }
  }

  addPassword(): void {
    this.navCtrl.navigateForward(['edit']);
  }

  editPassword(password: Password): void {
    this.navCtrl.navigateForward(['edit', password.id]);
  }

  logout(): void {
    this.passwordService.clearPasswords();
    this.navCtrl.navigateRoot(['login'], {replaceUrl: true});
  }
}
