import {Component} from '@angular/core';
import {NavController, ItemSliding} from 'ionic-angular';
import {EditPage} from "../edit/edit";
import {Todo} from "../../todo";
import {PasswordPage} from "../password/password";
import {TodoProvider} from "../../providers/todo/todo";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private readonly navCtrl: NavController,
              public readonly todoProvider: TodoProvider) {
  }

  addTodo() {
    this.navCtrl.push(EditPage);
  }

  editTodo(slidingItem: ItemSliding, todo: Todo) {
    slidingItem.close();
    this.navCtrl.push(EditPage, {
      todo: todo
    });
  }

  deleteTodo(slidingItem: ItemSliding, todo: Todo) {
    slidingItem.close();
    this.todoProvider.deleteTodo(todo);
  }

  exit() {
    this.todoProvider.todos = [];
    this.navCtrl.setRoot(PasswordPage);
  }
}
