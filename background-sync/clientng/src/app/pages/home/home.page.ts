import { Component, inject } from '@angular/core';
import {TodoService} from '../../services/todo.service';
import {Todo} from '../../todo';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRouterLink,
  IonTitle,
  IonToolbar,
  ViewDidEnter
} from "@ionic/angular/standalone";
import {addOutline} from "ionicons/icons";
import {addIcons} from "ionicons";

@Component({
  selector: 'app-page-home',
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
    IonItem,
    IonLabel,
    RouterLink,
    IonRouterLink,
    AsyncPipe
  ]
})
export class HomePage implements ViewDidEnter {
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);


  todos!: Promise<Todo[]>;

  constructor() {
    addIcons({addOutline});
    this.todoService.requestSync();

    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data === 'sync_finished') {
        this.todos = this.todoService.getTodos();
      }
    });
  }

  addTodo(): void {
    this.router.navigateByUrl('/edit');
  }

  ionViewDidEnter(): void {
    this.todos = this.todoService.getTodos();
  }
}
