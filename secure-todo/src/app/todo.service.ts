import {Injectable} from '@angular/core';
import {Todo} from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todos: Map<number, Todo> = null;

  private lastId = 0;
  private aesKey: any;

  private salt = 'This is the salt. It does not have to be secret';
  private iterations = 1000;
  private ivLen = 16;
  private textEncoder = new TextEncoder();
  private textDecoder = new TextDecoder();

  exit(): void {
    this.todos = null;
  }

  getTodos(): Todo[] {
    return [...this.todos.values()];
  }

  hasTodos(): boolean {
    return this.todos !== null;
  }

  getTodo(id: number): Todo {
    return this.todos.get(id);
  }

  deleteTodo(todo: Todo) {
    const deleted = this.todos.delete(todo.id);
    if (deleted) {
      this.encryptAndSaveTodos();
    }
  }

  save(todo: Todo) {
    if (!todo.id) {
      todo.id = ++this.lastId;
      localStorage.setItem('lastTodoId', JSON.stringify(this.lastId));
    }

    this.todos.set(todo.id, todo);
    this.encryptAndSaveTodos();
  }

  async setPassword(password: string) {
    const value = localStorage.getItem('lastTodoId');
    if (value) {
      this.lastId = JSON.parse(value);
    } else {
      this.lastId = null;
    }
    await this.deriveAesKey(password);
    return this.decryptTodos();
  }

  async decryptTodos() {
    const storedValue = localStorage.getItem('todos');
    if (storedValue) {
      const encryptedTodos = new Uint8Array(JSON.parse(storedValue));
      const decryptedBytes = await this.decrypt(encryptedTodos);
      const decryptedString = this.textDecoder.decode(decryptedBytes);
      this.todos = new Map(JSON.parse(decryptedString));
    } else {
      this.todos = new Map();
    }
  }

  async encryptAndSaveTodos() {
    const todosString = JSON.stringify([...this.todos]);
    const encrypted = await this.encrypt(this.textEncoder.encode(todosString));
    localStorage.setItem('todos', JSON.stringify(Array.from(encrypted)));
  }

  async deriveAesKey(password: string) {
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      this.textEncoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']);

    this.aesKey = await
      window.crypto.subtle.deriveKey({
          'name': 'PBKDF2',
          'salt': this.textEncoder.encode(this.salt),
          'iterations': this.iterations,
          'hash': 'SHA-256'
        },
        baseKey,
        {'name': 'AES-GCM', 'length': 128},
        false,
        ['encrypt', 'decrypt']);
  }

  private joinIvAndData(iv: Uint8Array, data: Uint8Array): Uint8Array {
    const buf = new Uint8Array(iv.length + data.length);
    iv.forEach((byte, i) => buf[i] = byte);
    data.forEach((byte, i) => buf[i + iv.length] = byte);
    return buf;
  }

  private separateIvFromData(buf: Uint8Array): { iv: Uint8Array, data: Uint8Array; } {
    const iv = new Uint8Array(this.ivLen);
    const data = new Uint8Array(buf.length - this.ivLen);
    buf.forEach((byte, i) => {
      if (i < this.ivLen) {
        iv[i] = byte;
      } else {
        data[i - this.ivLen] = byte;
      }
    });
    return {iv: iv, data: data};
  }

  private async encrypt(data) {
    const initializationVector = new Uint8Array(this.ivLen);
    crypto.getRandomValues(initializationVector);

    const encrypted = await crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: initializationVector
      },
      this.aesKey,
      data
    );

    return this.joinIvAndData(initializationVector, new Uint8Array(encrypted));
  }

  private decrypt(buffer: Uint8Array): PromiseLike<ArrayBuffer> {
    const parts = this.separateIvFromData(buffer);
    return window.crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv: parts.iv
      },
      this.aesKey,
      parts.data
    );
  }

}
