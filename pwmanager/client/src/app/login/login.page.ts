import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { PasswordService } from '../password.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonInput,
  ],
})
export class LoginPage {
  private readonly navCtrl = inject(NavController);
  private readonly passwordService = inject(PasswordService);

  async login(username: string, password: string): Promise<void> {
    await this.passwordService.fetchPasswords(username, password);
    this.navCtrl.navigateRoot(['home'], { replaceUrl: true });
  }
}
