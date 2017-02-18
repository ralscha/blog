import {Injectable} from '@angular/core';
import {Todo} from "../todo";
import {Storage} from "@ionic/storage";
import {TextEncoder, TextDecoder} from 'text-encoding-shim';

@Injectable()
export class TodoService {
  public todos: Todo[];

  private lastId: number = 0;
  private aesKey: any;

  private salt = "This is the salt. It does not have to be secret";
  private iterations = 1000;
  private ivLen = 16;
  private textEncoder = new TextEncoder("utf-8");
  private textDecoder = new TextDecoder("utf-8");

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
    return this.deriveAesKey(password).then(() => this.decryptTodos());
  }

  decryptTodos() {
    return this.storage.get('todos').then(encryptedTodos => {
        if (encryptedTodos) {
          return this.decrypt(encryptedTodos);
        }
        return null;
      }
    ).then(decryptedBuffer => {
      if (decryptedBuffer) {
        const decryptedString = this.textDecoder.decode(new Uint8Array(decryptedBuffer));
        this.todos = JSON.parse(decryptedString);
      }
      else {
        this.todos = [];
      }
    });
  }

  encryptAndSaveTodos() {
    const todosString = JSON.stringify(this.todos);
    this.encrypt(this.textEncoder.encode(todosString))
      .then(encrypted => this.storage.set('todos', encrypted));
  }

  deriveAesKey(password: string) {
    return window.crypto.subtle.importKey(
      "raw",
      this.textEncoder.encode(password),
      {"name": "PBKDF2"},
      false,
      ["deriveKey"])
      .then(baseKey =>
        window.crypto.subtle.deriveKey({
            "name": "PBKDF2",
            "salt": this.textEncoder.encode(this.salt),
            "iterations": this.iterations,
            "hash": 'SHA-256'
          },
          baseKey,
          {"name": "AES-GCM", "length": 128},
          false,
          ["encrypt", "decrypt"]
        )
      )
      .then(aesKey => {
        this.aesKey = aesKey;
      });
  }

  joinIvAndData(iv: Uint8Array, data: Uint8Array) {
    const buf = new Uint8Array(iv.length + data.length);
    iv.forEach((byte, i) => buf[i] = byte);
    data.forEach((byte, i) => buf[i + iv.length] = byte);
    return buf;
  }

  separateIvFromData(buf: Uint8Array) {
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

  encrypt(data) {
    const initializationVector = new Uint8Array(this.ivLen);
    crypto.getRandomValues(initializationVector);
    return crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: initializationVector
      },
      this.aesKey,
      data
    ).then(encrypted => this.joinIvAndData(initializationVector, new Uint8Array(encrypted)));
  }

  decrypt(buffer: Uint8Array): PromiseLike<any> {
    const parts = this.separateIvFromData(buffer);
    return window.crypto.subtle.decrypt({
        name: "AES-GCM",
        iv: parts.iv
      },
      this.aesKey,
      parts.data
    );
  }

}

