import {Component, NgZone} from '@angular/core';
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
              private readonly router: Router,
              private readonly ngZone: NgZone) {
    this.todoService.requestSync();

    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data === 'sync_finished') {
        ngZone.run(() => {
          this.todos = this.todoService.getTodos();
        });
      }
    });
  }

  addTodo() {
    this.router.navigateByUrl('/edit');
  }

  ionViewWillEnter() {
    this.todos = this.todoService.getTodos();
  }
}
