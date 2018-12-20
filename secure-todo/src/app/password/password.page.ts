import {Component} from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {TodoService} from '../todo.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage {

  constructor(private readonly navCtrl: NavController,
              private readonly todoService: TodoService,
              private readonly toastCtrl: ToastController) {
  }

  async showTodos(password: string) {
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
