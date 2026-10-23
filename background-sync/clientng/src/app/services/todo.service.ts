import { DestroyRef, inject, Service } from '@angular/core';
import { Todo, TodoDb } from '../todo';
import { v4 as uuidv4 } from 'uuid';

const SYNC_TAG = 'todo_updated';

@Service()
export class TodoService {
  private db: TodoDb;

  constructor() {
    this.db = new TodoDb();
    const retry = () => { void this.requestSync(); };
    const timer = window.setInterval(retry, 30_000);
    window.addEventListener('online', retry);
    inject(DestroyRef).onDestroy(() => {
      window.clearInterval(timer);
      window.removeEventListener('online', retry);
    });
  }

  async getTodos(): Promise<Todo[]> {
    return this.db.todos.where('ts').notEqual(-1).toArray();
  }

  getTodo(id: string): Promise<Todo | undefined> {
    return this.db.todos.get(id);
  }

  deleteTodo(todo: Todo): void {
    todo.ts = -1;
    this.db.todos.put(todo).then(() => this.requestSync());
  }

  async save(todo: Todo): Promise<void> {
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

  async requestSync(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    try {
      const swRegistration = await navigator.serviceWorker.ready;
      swRegistration.active?.postMessage({ type: SYNC_TAG });
      if (swRegistration.sync) {
        await swRegistration.sync.register(SYNC_TAG);
      }
    } catch (error) {
      console.warn('Background Sync registration failed; foreground retries remain active', error);
    }
  }

  private changed(oldTodo: Todo | undefined, newTodo: Todo): boolean {
    if (!oldTodo || oldTodo.subject !== newTodo.subject) {
      return true;
    }
    return oldTodo.description !== newTodo.description;
  }
}
