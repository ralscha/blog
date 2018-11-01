import {Component} from '@angular/core';
import {TodoService} from '../../services/todo.service';
import {Todo} from '../../todo';
import {Router} from '@angular/router';

@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  todos: Promise<Todo[]>;

  constructor(private readonly todoService: TodoService,
              private readonly router: Router) {
    this.todoService.requestSync();

    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data === 'sync_finished') {
          this.todos = this.todoService.getTodos();
      }
    });
  }

  addTodo() {
    this.router.navigateByUrl('/edit');
  }

  ionViewDidEnter() {
    this.todos = this.todoService.getTodos();
  }
}
