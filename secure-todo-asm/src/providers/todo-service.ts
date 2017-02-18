import {Injectable} from '@angular/core';
import {Todo} from "../todo";
import {Storage} from "@ionic/storage";
import asmCrypto from "asmcrypto.js"

@Injectable()
export class TodoService {
  public todos: Todo[];

  private lastId: number = 0;
  private aesKey: any;

  private salt = "This is the salt. It does not have to be secret";
  private iterations = 4096;
  private nonceLen = 12;

  constructor(private readonly storage: Storage) {
  }

  deleteTodo(todo: Todo) {
    const index = this.todos.findIndex(el => el.id === todo.id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.encryptAndSaveTodos();
    }
  }

  save(todo: Todo) {
    const index = this.todos.findIndex(el => el.id === todo.id);
    if (index !== -1) {
      this.todos[index] = todo;
    }
    else {
      todo.id = ++this.lastId;
      this.todos.push(todo);
    }

    this.storage.set('lastTodoId', this.lastId);
    this.encryptAndSaveTodos();
  }

  setPassword(password: string) {
    this.storage.get('lastTodoId').then(id => this.lastId = id);
    this.deriveAesKey(password);
    return this.decryptTodos();
  }

  decryptTodos() {
    return this.storage.get('todos').then(encryptedTodos => {
        if (encryptedTodos) {
          try {
            const encryptedBytes = this.decrypt(encryptedTodos);
            const decryptedString = asmCrypto.bytes_to_string(encryptedBytes);
            this.todos = JSON.parse(decryptedString);
          } catch (err) {
            return Promise.reject(err);
          }
        }
        else {
          this.todos = [];
        }
      }
    );
  }

  encryptAndSaveTodos() {
    const todosString = JSON.stringify(this.todos);
    const encrypted = this.encrypt(todosString);
    this.storage.set('todos', encrypted);
  }

  deriveAesKey(password: string) {
    this.aesKey = asmCrypto.PBKDF2_HMAC_SHA256.bytes(password, this.salt, this.iterations, 32);
  }

  joinNonceAndData(nonce: Uint8Array, data: Uint8Array) {
    const buf = new Uint8Array(nonce.length + data.length);
    nonce.forEach((byte, i) => buf[i] = byte);
    data.forEach((byte, i) => buf[i + nonce.length] = byte);
    return buf;
  }

  separateNonceFromData(buf: Uint8Array) {
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

  encrypt(data) {
    const nonce = new Uint8Array(this.nonceLen);
    asmCrypto.getRandomValues(nonce);

    const encrypted = asmCrypto.AES_GCM.encrypt(data, this.aesKey, nonce);
    return this.joinNonceAndData(nonce, new Uint8Array(encrypted));
  }

  decrypt(buffer: Uint8Array) {
    const parts = this.separateNonceFromData(buffer);
    const decrypted = asmCrypto.AES_GCM.decrypt(parts.data, this.aesKey, parts.nonce);
    return decrypted;
  }

}

