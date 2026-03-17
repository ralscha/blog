import {Component, inject, OnInit} from '@angular/core';
import {Todo, TodoService} from '../swagger';
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
import {TodoStateService} from '../todo-state.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonList, IonItem, IonInput, IonFooter, IonButton]
})
export class EditPage implements OnInit {
  todo!: Todo;
  private readonly navCtrl = inject(NavController);
  private readonly todoService = inject(TodoService);
  private readonly todoState = inject(TodoStateService);

  ngOnInit(): void {
    const todo = this.todoState.selectedTodo();
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
    this.todoService.save(this.todo).subscribe(() => {
      this.todoState.clear();
      this.navCtrl.navigateBack(['home']);
    });
  }

}
