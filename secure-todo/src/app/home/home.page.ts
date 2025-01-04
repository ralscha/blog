import {Component} from '@angular/core';
import {IonItemSliding, NavController, ViewDidEnter} from '@ionic/angular';
import {TodoService} from '../todo.service';
import {Todo} from '../todo';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage implements ViewDidEnter {

  todos: Todo[] = [];

  constructor(private readonly navCtrl: NavController,
              private readonly todoService: TodoService) {
  }

  ionViewDidEnter(): void {
    this.todos = this.todoService.getTodos();
  }

  addTodo(): void {
    this.navCtrl.navigateForward(['edit']);
  }

  editTodo(slidingItem: IonItemSliding, todo: Todo): void {
    slidingItem.close();
    this.navCtrl.navigateForward(['edit', todo.id]);
  }

  deleteTodo(slidingItem: IonItemSliding, todo: Todo): void {
    slidingItem.close();
    this.todoService.deleteTodo(todo);
    this.ionViewDidEnter();
  }

  exit(): void {
    this.todoService.exit();
    this.navCtrl.navigateRoot(['password'], {replaceUrl: true});
  }

}
