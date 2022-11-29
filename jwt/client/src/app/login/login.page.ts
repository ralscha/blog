import {Component} from '@angular/core';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {AuthService} from '../auth.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private readonly navCtrl: NavController,
              private readonly loadingCtrl: LoadingController,
              private readonly authService: AuthService,
              private readonly toastCtrl: ToastController) {
  }

  signup(): void {
    this.navCtrl.navigateRoot(['signup']);
  }

  async login(value: { username: string, password: string }): Promise<void> {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Logging in ...'
    });

    await loading.present();

    this.authService
      .login(value)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: () => this.navCtrl.navigateRoot(['home'], {replaceUrl: true}),
        error: err => this.handleError(err)
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleError(error: any): Promise<void> {
    let message: string;
    if (error.status && error.status === 401) {
      message = 'Login failed';
    } else {
      message = `Unexpected error: ${error.statusText}`;
    }

    const toast = await this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom'
    });

    await toast.present();
  }

}
