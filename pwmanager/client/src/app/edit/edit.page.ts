import {Component, inject, OnInit} from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
  NavController
} from '@ionic/angular/standalone';
import {v4} from 'uuid';
import {PasswordService} from '../password.service';
import {Password} from '../password';
import {ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {addIcons} from "ionicons";
import {trashOutline} from "ionicons/icons";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  imports: [FormsModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonIcon, IonContent, IonList, IonItem, IonInput, IonFooter]
})
export class EditPage implements OnInit {
  password: Password | undefined = undefined;
  private readonly navCtrl = inject(NavController);
  private readonly route = inject(ActivatedRoute);
  private readonly passwordService = inject(PasswordService);

  constructor() {
    addIcons({trashOutline});
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.password = this.passwordService.getPassword(id);
      if (this.password === undefined) {
        this.navCtrl.navigateBack(['home']);
      }
    } else {
      this.password = {
        id: '',
        url: '',
        username: '',
        password: '',
        description: ''
      };
    }
  }

  async save(): Promise<void> {
    if (this.password === undefined) {
      return Promise.reject('password empty');
    }

    if (!this.password.id) {
      this.password.id = v4();
    }
    await this.passwordService.savePassword(this.password);
    this.navCtrl.navigateBack(['home']);
  }

  deletePassword(): void {
    if (this.password?.id) {
      this.passwordService.deletePassword(this.password);
      this.navCtrl.navigateBack(['home']);
    }
  }
}
