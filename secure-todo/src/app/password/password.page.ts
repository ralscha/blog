import {Component, inject} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonTitle,
  IonToolbar,
  NavController,
  ToastController
} from '@ionic/angular/standalone';
import {TodoService} from '../todo.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrl: './password.page.scss',
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton]
})
export class PasswordPage {
  private readonly navCtrl = inject(NavController);
  private readonly todoService = inject(TodoService);
  private readonly toastCtrl = inject(ToastController);


  async showTodos(password: string): Promise<void> {
    try {
      await this.todoService.setPassword(password);
      this.navCtrl.navigateRoot('home', {replaceUrl: true});
    } catch (e) {
      const toast = await this.toastCtrl.create({
        message: 'Decryption unsuccessful',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

}
