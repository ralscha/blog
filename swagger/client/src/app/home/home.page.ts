import {Component} from '@angular/core';
import {Todo, TodoServiceService} from '../swagger';
import {IonItemSliding, NavController, ViewDidEnter} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements ViewDidEnter {

  todos: Todo[] = [];

  constructor(private readonly navCtrl: NavController,
              private readonly todoService: TodoServiceService) {
  }

  ionViewDidEnter(): void {
    this.todoService.listUsingGET().subscribe(data => this.todos = data);
  }

  addTodo(): void {
    this.todoService.selectedTodo = null;
    this.navCtrl.navigateForward(['edit']);
  }

  editTodo(slidingItem: IonItemSliding, todo: Todo): void {
    slidingItem.close();
    this.todoService.selectedTodo = todo;
    this.navCtrl.navigateForward(['edit']);
  }

  deleteTodo(slidingItem: IonItemSliding, todo: Todo): void {
    slidingItem.close();
    this.todoService.deleteUsingPOST(todo.id).subscribe(() => this.ionViewDidEnter());
  }

}
