import {Injectable, signal} from '@angular/core';
import {Todo} from './swagger';

@Injectable({
  providedIn: 'root'
})
export class TodoStateService {
  readonly selectedTodo = signal<Todo | undefined>(undefined);

  set(todo: Todo): void {
    this.selectedTodo.set(structuredClone(todo));
  }

  clear(): void {
    this.selectedTodo.set(undefined);
  }
}