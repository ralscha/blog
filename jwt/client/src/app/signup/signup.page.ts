import {Component, inject, ViewChild} from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
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
import {FormsModule, NgModel} from '@angular/forms';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  imports: [FormsModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton]
})
export class SignupPage {
  @ViewChild('username')
  usernameModel!: NgModel;
  private readonly navCtrl = inject(NavController);
  private readonly authService = inject(AuthService);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);

  async signup(value: { name: string, email: string, username: string, password: string }): Promise<void> {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Signing up ...'
    });

    loading.present();

    this.authService
      .signup(value)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        jwt => this.showSuccesToast(jwt),
        err => this.handleError(err));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleError(error: any): Promise<void> {
    const message = 'Unexpected error occurred: ' + error;

    const toast = await this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }

  private async showSuccesToast(jwt: string): Promise<void> {
    if (jwt !== 'EXISTS') {
      const toast = await this.toastCtrl.create({
        message: 'Sign up successful',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
      this.navCtrl.navigateRoot(['home'], {replaceUrl: true});
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Username already registered',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();

      this.usernameModel.control.setErrors({usernameTaken: true});
    }
  }


}
