import {Component, inject} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonIcon,
  IonNote,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  NavController,
  ViewDidEnter
} from '@ionic/angular/standalone';
import {PasswordService} from '../password.service';
import {Password} from '../password';
import {FormsModule} from "@angular/forms";
import {addIcons} from "ionicons";
import {addOutline, exitOutline} from "ionicons/icons";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  imports: [FormsModule, IonHeader, IonToolbar, IonButtons, IonTitle, IonButton, IonIcon, IonContent, IonSearchbar, IonCard, IonCardHeader, IonCardContent, IonNote]
})
export class HomePage implements ViewDidEnter {
  passwords: Password[] = [];
  private readonly navCtrl = inject(NavController);
  private readonly passwordService = inject(PasswordService);

  constructor() {
    addIcons({exitOutline, addOutline});
  }

  ionViewDidEnter(): void {
    this.passwords = this.passwordService.getPasswords();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
