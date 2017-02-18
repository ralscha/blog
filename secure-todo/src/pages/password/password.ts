import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {TodoService} from "../../providers/todo-service";

@Component({
  selector: 'page-password',
  templateUrl: 'password.html'
})
export class PasswordPage {

  constructor(private readonly navCtrl: NavController,
              private readonly todoService: TodoService) {
  }

  showTodos(password: string) {
    this.todoService.setPassword(password).then(() => this.navCtrl.setRoot(HomePage));

  }

}
