import {Component, inject} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  NavController,
  ViewDidEnter
} from '@ionic/angular/standalone';
import {TodoService} from '../todo.service';
import {Todo} from '../todo';
import {addIcons} from "ionicons";
import {addOutline, createOutline, exitOutline, trashOutline} from "ionicons/icons";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItemSliding,
    IonLabel,
    IonItem,
    IonItemOptions
  ]
})
export class HomePage implements ViewDidEnter {
  todos: Todo[] = [];
  private readonly navCtrl = inject(NavController);
  private readonly todoService = inject(TodoService);

  constructor() {
    addIcons({exitOutline, addOutline, createOutline, trashOutline});
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
