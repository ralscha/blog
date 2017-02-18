import {Component} from '@angular/core';
import {NavController, ItemSliding} from 'ionic-angular';
import {EditPage} from "../edit/edit";
import {TodoService} from "../../providers/todo-service";
import {Todo} from "../../todo";
import {PasswordPage} from "../password/password";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private readonly navCtrl: NavController,
              public readonly todoService: TodoService) {
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
    this.todoService.deleteTodo(todo);
  }

  exit() {
    this.todoService.todos = [];
    this.navCtrl.setRoot(PasswordPage);
  }
}
