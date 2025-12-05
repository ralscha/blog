import {Injectable} from '@angular/core';
import {TextEncoder} from 'text-encoding-shim';
import * as LZUTF8 from 'lzutf8';
import {environment} from '../environments/environment';
import {Password} from './password';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private ivLen = 12;

  private passwords = new Map<string, Password>();
  private masterKey: CryptoKey | null = null;
  private authenticationKey: Uint8Array | null = null;
  private textEncoder = new TextEncoder('utf-8');
  private loggedIn = false;

  getPasswords(): Password[] {
    return [...this.passwords.values()];
  }

  getPassword(id: string): Password | undefined {
    return this.passwords.get(id);
  }

  clearPasswords(): void {
    this.passwords.clear();
    this.masterKey = null;
    this.authenticationKey = null;
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  async fetchPasswords(username: string, password: string): Promise<void> {
    await this.initKeys(username, password);

    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');

    const response = await fetch(`${environment.serverUrl}/fetch`, {
      headers,
      method: 'POST',
      body: this.authenticationKey ? new Blob([this.authenticationKey.buffer.slice(0) as ArrayBuffer]) : null
    });

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > 0) {
      await this.decrypt(arrayBuffer);
    }
    this.loggedIn = true;
  }

  deletePassword(password: Password): void {
    const deleted = this.passwords.delete(password.id);
    if (deleted) {
      this.encryptAndStore();
    }
  }

  savePassword(password: Password): Promise<void> {
    this.passwords.set(password.id, password);
    return this.encryptAndStore();
  }

  private async initKeys(username: string, password: string): Promise<void> {
    const salt = new Uint8Array(this.textEncoder.encode(username).buffer.slice(0));

    const passwordData = this.textEncoder.encode(password);
    const importedPassword = await crypto.subtle.importKey('raw', passwordData.buffer.slice(0) as ArrayBuffer,
      'PBKDF2', false, ['deriveKey']);

    const tempKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2', salt: salt.buffer.slice(0) as ArrayBuffer,
        iterations: 300000, hash: 'SHA-256'
      },
      importedPassword,
      {name: 'AES-GCM', length: 256},
      true,
      ['encrypt']
    );

    const exportedTempKey = await crypto.subtle.exportKey('raw', tempKey);
    const importedTempKey = await crypto.subtle.importKey('raw', exportedTempKey,
      'PBKDF2', false, ['deriveKey']);

    this.masterKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2', salt: salt.buffer.slice(0) as ArrayBuffer,
        iterations: 50000, hash: 'SHA-256'
      },
      importedTempKey,
      {name: 'AES-GCM', length: 256},
      false,
      ['encrypt', 'decrypt']
    );

    const authKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2', salt: salt.buffer.slice(0) as ArrayBuffer,
        iterations: 300000, hash: 'SHA-256'
      },
      importedTempKey,
      {name: 'AES-GCM', length: 256},
      true,
      ['encrypt']
    );

    this.authenticationKey = new Uint8Array(await crypto.subtle.exportKey('raw', authKey));
  }

  private concatUint8Array(...arrays: Uint8Array[]): Uint8Array {
    let totalLength = 0;
    for (const arr of arrays) {
      totalLength += arr.length;
    }
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }

  private async encryptAndStore(): Promise<void> {
    if (this.authenticationKey === null) {
      return Promise.reject('authentication key is null');
    }

    const encryptedData = await this.encrypt();
    const authKeyAndData = this.concatUint8Array(this.authenticationKey, encryptedData);

    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');

    const requestParams = {
      headers,
      method: 'POST',
      body: new Blob([authKeyAndData.buffer.slice(0) as ArrayBuffer])
    };
    fetch(`${environment.serverUrl}/store`, requestParams);
  }

  private async encrypt(): Promise<Uint8Array> {
    if (this.masterKey === null) {
      return Promise.reject('master key is null');
    }

    const compressed = LZUTF8.compress(JSON.stringify([...this.passwords]));

    const initializationVector = new Uint8Array(this.ivLen);
    crypto.getRandomValues(initializationVector);

    const encrypted = await crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: initializationVector
      },
      this.masterKey,
      compressed
    );

    return this.concatUint8Array(initializationVector, new Uint8Array(encrypted));
  }

  private async decrypt(buffer: ArrayBuffer): Promise<void> {
    if (this.masterKey === null) {
      return Promise.reject('master key is null');
    }

    const iv = buffer.slice(0, this.ivLen);
    const data = buffer.slice(this.ivLen);

    const decrypted = await window.crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv
      },
      this.masterKey,
      data
    );

    const uncompressed = LZUTF8.decompress(new Uint8Array(decrypted));
    this.passwords = new Map(JSON.parse(uncompressed));
  }

}
