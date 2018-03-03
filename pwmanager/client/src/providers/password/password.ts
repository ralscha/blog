import {Injectable} from '@angular/core';
import {Password} from '../../../password';
import {TextEncoder} from 'text-encoding-shim';
import * as LZUTF8 from 'lzutf8';

@Injectable()
export class PasswordProvider {
  private serverUrl = "http://192.168.178.20:8080";
  private ivLen = 12;

  private passwords: Password[] = [];
  private masterKey: CryptoKey;
  private authenticationKey: Uint8Array;
  private textEncoder = new TextEncoder("utf-8");

  getPasswords(): Password[] {
    return this.passwords;
  }

  clearPasswords(): void {
    this.passwords = [];
    this.masterKey = null;
    this.authenticationKey = null;
  }

  async fetchPasswords(username: string, password: string) {
    await this.initKeys(username, password);

    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');

    const response = await fetch(`${this.serverUrl}/fetch`, {
      headers,
      method: 'POST',
      body: this.authenticationKey
    });

    const blob = await response.blob();

    if (blob.size > 0) {
      const buffer = await this.blobToArrayBuffer(blob);
      this.decrypt(buffer);
    }
  }

  private async initKeys(username: string, password: string): Promise<void> {
    const salt = this.textEncoder.encode(username);

    const importedPassword = await crypto.subtle.importKey('raw', this.textEncoder.encode(password),
      {name: 'PBKDF2'}, false, ['deriveKey']);

    const tempKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2', salt: salt,
        iterations: 100000, hash: 'SHA-256'
      },
      importedPassword,
      {name: 'AES-GCM', length: 256},
      true,
      ['encrypt']
    );

    const exportedTempKey = await crypto.subtle.exportKey('raw', tempKey);
    const importedTempKey = await crypto.subtle.importKey('raw', exportedTempKey,
      {name: 'PBKDF2'}, false, ['deriveKey']);

    this.masterKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2', salt: salt,
        iterations: 10000, hash: 'SHA-256'
      },
      importedTempKey,
      {name: 'AES-GCM', length: 256},
      false,
      ['encrypt', 'decrypt']
    );

    const authKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2', salt: salt,
        iterations: 100000, hash: 'SHA-256'
      },
      importedTempKey,
      {name: 'AES-GCM', length: 256},
      true,
      ['encrypt']
    );

    this.authenticationKey = new Uint8Array(await crypto.subtle.exportKey('raw', authKey));
  }

  deletePassword(passwords: Password) {
    const index = this.passwords.findIndex(el => el.id === passwords.id);
    if (index !== -1) {
      this.passwords.splice(index, 1);
      this.encryptAndStore();
    }
  }

  savePassword(passwords: Password) {
    const index = this.passwords.findIndex(el => el.id === passwords.id);
    if (index !== -1) {
      this.passwords[index] = passwords;
    }
    else {
      this.passwords.push(passwords);
    }
    this.encryptAndStore();
  }

  private blobToArrayBuffer(blob): Promise<ArrayBuffer> {
    var fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onload = evt => resolve(fileReader.result);
      fileReader.onerror = reject;

      fileReader.readAsArrayBuffer(blob);
    });
  };


  private concatUint8Array(...arrays: Uint8Array[]): Uint8Array {
    let totalLength = 0;
    for (let arr of arrays) {
      totalLength += arr.length;
    }
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (let arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }

  private async encryptAndStore(): Promise<void> {
    const encryptedData = await this.encrypt();
    const authKeyAndData = this.concatUint8Array(this.authenticationKey, encryptedData);

    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');

    const requestParams = {
      headers,
      method: 'POST',
      body: authKeyAndData
    };
    fetch(`${this.serverUrl}/store`, requestParams);
  }

  private async encrypt(): Promise<Uint8Array> {

    const compressed = LZUTF8.compress(JSON.stringify(this.passwords));

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
    const iv = buffer.slice(0, this.ivLen);
    const data = buffer.slice(this.ivLen);

    const decrypted = await window.crypto.subtle.decrypt({
        name: "AES-GCM",
        iv: iv
      },
      this.masterKey,
      data
    );

    const uncompressed = LZUTF8.decompress(new Uint8Array(decrypted));
    this.passwords = JSON.parse(uncompressed);
  }

}
