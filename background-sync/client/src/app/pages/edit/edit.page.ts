import { Component, OnInit, inject } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TodoService} from '../../services/todo.service';
import {Todo} from '../../todo';
import {FormsModule, NgForm} from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {trashOutline} from "ionicons/icons";
import {addIcons} from "ionicons";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrl: './edit.page.scss',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    FormsModule,
    IonItem,
    IonInput
  ]
})
export class EditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);


  todo: Todo | undefined;

  constructor() {
    addIcons({trashOutline});
  }

  async ngOnInit(): Promise<void> {
    const todoId = this.route.snapshot.paramMap.get('id');
    if (todoId) {
      this.todo = await this.todoService.getTodo(todoId);
    } else {
      this.todo = {
        id: '',
        subject: '',
        description: '',
        ts: 0
      };
    }
  }

  deleteTodo(): void {
    if (this.todo?.id) {
      this.todoService.deleteTodo(this.todo);
    }
    this.router.navigateByUrl('/');
  }

  save(form: NgForm): void {
    if (this.todo) {
      this.todo.subject = form.value.subject;
      this.todo.description = form.value.description;
      this.todoService.save(this.todo);
    }
    this.router.navigateByUrl('/');
  }

}
