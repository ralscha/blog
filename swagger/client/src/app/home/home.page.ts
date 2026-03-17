import {Component, inject} from '@angular/core';
import {Todo, TodoService} from '../swagger';
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
import {addIcons} from "ionicons";
import {addOutline, createOutline, trashOutline} from "ionicons/icons";
import {TodoStateService} from '../todo-state.service';

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
    IonItem,
    IonLabel,
    IonItemOptions
  ]
})
export class HomePage implements ViewDidEnter {
  todos: Todo[] = [];
  private readonly navCtrl = inject(NavController);
  private readonly todoService = inject(TodoService);
  private readonly todoState = inject(TodoStateService);

  constructor() {
    addIcons({addOutline, createOutline, trashOutline});
  }

  ionViewDidEnter(): void {
    this.todoService.list().subscribe(data => this.todos = data);
  }

  addTodo(): void {
    this.todoState.clear();
    this.navCtrl.navigateForward(['edit']);
  }

  editTodo(slidingItem: IonItemSliding, todo: Todo): void {
    slidingItem.close();
    this.todoState.set(todo);
    this.navCtrl.navigateForward(['edit']);
  }

  deleteTodo(slidingItem: IonItemSliding, todo: Todo): void {
    slidingItem.close();
    if (!todo.id) {
      return;
    }

    this.todoService._delete(todo.id).subscribe(() => this.ionViewDidEnter());
  }

}
