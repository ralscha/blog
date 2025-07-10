import {Component, inject, OnInit} from '@angular/core';
import {Todo, TodoServiceService} from '../swagger';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
  NavController
} from '@ionic/angular/standalone';
import {v4} from 'uuid';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonList, IonItem, IonInput, IonFooter, IonButton]
})
export class EditPage implements OnInit {
  todo!: Todo;
  private readonly navCtrl = inject(NavController);
  private readonly todoService = inject(TodoServiceService);

  ngOnInit(): void {
    const todo = this.todoService.selectedTodo;
    if (todo) {
      this.todo = todo;
    } else {
      this.todo = {
        id: v4(),
        title: '',
        description: ''
      };
    }
  }

  save(): void {
    this.todoService.save(this.todo).subscribe(() => this.navCtrl.navigateBack(['home']));
  }

}
