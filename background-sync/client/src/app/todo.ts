import Dexie from 'dexie';

export class TodoDb extends Dexie {
  todos!: Dexie.Table<Todo, string>;

  constructor() {
    super('Todo');
    this.version(1).stores({
      todos: 'id,ts'
    });
  }
}

export interface Todo {
  id: string;
  subject: string;
  description?: string;
  ts: number;
}
