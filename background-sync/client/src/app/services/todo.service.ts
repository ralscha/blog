import {Injectable} from '@angular/core';
import {Todo, TodoDb} from '../todo';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private db: TodoDb;

  constructor() {
    this.db = new TodoDb();
  }

  async getTodos(): Promise<Todo[]> {
    return this.db.todos.where('ts').notEqual(-1).toArray();
  }

  getTodo(id: string): Promise<Todo> {
    return this.db.todos.get(id);
  }

  deleteTodo(todo: Todo) {
    todo.ts = -1;
    this.db.todos.put(todo).then(() => this.requestSync());
  }

  async save(todo: Todo) {
    if (!todo.id) {
      todo.id = uuidv4();
      todo.ts = 0;
      this.db.todos.add(todo).then(() => this.requestSync());
    } else {
      const oldTodo = await this.db.todos.get(todo.id);
      if (this.changed(oldTodo, todo)) {
        todo.ts = Date.now();
        this.db.todos.put(todo).then(() => this.requestSync());
      }
    }
  }

  async requestSync() {
    const swRegistration = await navigator.serviceWorker.ready;
    swRegistration.sync.register('todo_updated');
  }

  private changed(oldTodo: Todo, newTodo: Todo) {
    if (oldTodo.subject !== newTodo.subject) {
      return true;
    }
    return oldTodo.description !== newTodo.description;

  }
}
