import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TodoService} from '../../services/todo.service';
import {Todo} from '../../todo';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  todo: Todo | undefined;

  constructor(private readonly route: ActivatedRoute,
              private readonly todoService: TodoService,
              private readonly router: Router) {
  }

  async ngOnInit(): Promise<void> {
    const todoId = this.route.snapshot.paramMap.get('id');
    if (todoId) {
      this.todo = await this.todoService.getTodo(todoId);
    } else {
      this.todo = {
        id: null,
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
