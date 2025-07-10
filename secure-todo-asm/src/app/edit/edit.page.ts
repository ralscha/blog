import {Component, inject, OnInit} from '@angular/core';
import {Todo} from '../todo';
import {ActivatedRoute} from '@angular/router';
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
import {TodoService} from '../todo.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  imports: [FormsModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonInput, IonFooter, IonButton]
})
export class EditPage implements OnInit {
  todo: Todo | undefined;
  private readonly navCtrl = inject(NavController);
  private readonly route = inject(ActivatedRoute);
  private readonly todoService = inject(TodoService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.todo = this.todoService.getTodo(parseInt(id, 10));
    } else {
      this.todo = {
        title: '',
        description: ''
      };
    }
  }

  save(): void {
    if (this.todo) {
      this.todoService.save(this.todo);
    }
    this.navCtrl.navigateBack(['home']);
  }

}
