import {Component, inject} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
  LoadingController,
  NavController,
  ToastController
} from '@ionic/angular/standalone';
import {AuthService} from '../auth.service';
import {finalize} from 'rxjs/operators';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton]
})
export class LoginPage {
  private readonly navCtrl = inject(NavController);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly authService = inject(AuthService);
  private readonly toastCtrl = inject(ToastController);


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
