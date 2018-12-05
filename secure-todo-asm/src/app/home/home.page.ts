import {Component} from '@angular/core';
import {ItemSliding, NavController} from '@ionic/angular';
import {TodoService} from '../todo.service';
import {Todo} from '../todo';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  todos: Todo[] = [];

  constructor(private readonly navCtrl: NavController,
              private readonly todoService: TodoService) {
  }

  ionViewDidEnter() {
    this.todos = this.todoService.getTodos();
  }

  addTodo() {
    this.navCtrl.navigateForward(['edit']);
  }

  editTodo(slidingItem: ItemSliding, todo: Todo) {
    slidingItem.close();
    this.navCtrl.navigateForward(['edit', todo.id]);
  }

  deleteTodo(slidingItem: ItemSliding, todo: Todo) {
    slidingItem.close();
    this.todoService.deleteTodo(todo);
    this.ionViewDidEnter();
  }

  exit() {
    this.todoService.exit();
    this.navCtrl.navigateRoot(['password'], true, {replaceUrl: true});
  }

}
