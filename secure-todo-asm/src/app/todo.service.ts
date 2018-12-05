import {Injectable} from '@angular/core';
import {Todo} from './todo';
import {bytes_to_string, string_to_bytes} from 'asmcrypto.js/dist_es5/other/utils';
import {AES_GCM} from 'asmcrypto.js/dist_es5/aes/gcm';
import {Pbkdf2HmacSha256} from 'asmcrypto.js/dist_es5/pbkdf2/pbkdf2-hmac-sha256';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todos: Map<number, Todo> = null;

  private lastId = 0;
  private aesKey: any;

  private salt = string_to_bytes('This is the salt. It does not have to be secret');
  private iterations = 4096;
  private nonceLen = 12;

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

  setPassword(password: string) {
    const value = localStorage.getItem('lastTodoId');
    if (value) {
      this.lastId = JSON.parse(value);
    } else {
      this.lastId = null;
    }

    this.deriveAesKey(password);
    return this.decryptTodos();
  }

  decryptTodos() {
    const binaryString = localStorage.getItem('todos');
    if (binaryString) {
      const encryptedTodos = string_to_bytes(binaryString);
      try {
        const encryptedBytes = this.decrypt(encryptedTodos);
        const decryptedString = bytes_to_string(encryptedBytes);
        this.todos = new Map(JSON.parse(decryptedString));
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      this.todos = new Map();
    }
  }

  encryptAndSaveTodos(): void {
    const todosString = JSON.stringify([...this.todos]);
    const encrypted = this.encrypt(string_to_bytes(todosString));
    localStorage.setItem('todos', bytes_to_string(encrypted));
  }

  deriveAesKey(password: string): void {
    this.aesKey = Pbkdf2HmacSha256(string_to_bytes(password), this.salt, this.iterations, 32);
  }

  joinNonceAndData(nonce: Uint8Array, data: Uint8Array): Uint8Array {
    const buf = new Uint8Array(nonce.length + data.length);
    nonce.forEach((byte, i) => buf[i] = byte);
    data.forEach((byte, i) => buf[i + nonce.length] = byte);
    return buf;
  }

  separateNonceFromData(buf: Uint8Array): { nonce: Uint8Array, data: Uint8Array } {
    const nonce = new Uint8Array(this.nonceLen);
    const data = new Uint8Array(buf.length - this.nonceLen);
    buf.forEach((byte, i) => {
      if (i < this.nonceLen) {
        nonce[i] = byte;
      } else {
        data[i - this.nonceLen] = byte;
      }
    });
    return {nonce, data};
  }

  encrypt(data: Uint8Array): Uint8Array {
    const nonce = new Uint8Array(this.nonceLen);
    this.getRandomValues(nonce);

    const encrypted = AES_GCM.encrypt(data, this.aesKey, nonce);
    return this.joinNonceAndData(nonce, new Uint8Array(encrypted));
  }

  decrypt(buffer: Uint8Array): Uint8Array {
    const parts = this.separateNonceFromData(buffer);
    const decrypted = AES_GCM.decrypt(parts.data, this.aesKey, parts.nonce);
    return decrypted;
  }

  getRandomValues(buf: Uint32Array | Uint8Array): void {
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(buf);
      return;
    }

    // @ts-ignore
    if (window.msCrypto && window.msCrypto.getRandomValues) {
      // @ts-ignore
      window.msCrypto.getRandomValues(buf);
      return;
    }
    throw new Error('No secure random number generator available.');
  }
}
