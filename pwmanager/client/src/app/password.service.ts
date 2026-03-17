import { Injectable } from '@angular/core';
import { gunzipSync, gzipSync, strFromU8, strToU8 } from 'fflate';
import { environment } from '../environments/environment';
import { Password } from './password';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  private readonly ivLen = 12;
  private readonly pbkdf2Iterations = 600_000;
  private readonly derivedKeyLength = 64;

  private passwords = new Map<string, Password>();
  private masterKey: CryptoKey | null = null;
  private authenticationKey: Uint8Array | null = null;
  private readonly textEncoder = new TextEncoder();
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

    const response = await fetch(`${environment.serverUrl}/fetch`, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      method: 'POST',
      body: this.authenticationKey
        ? new Blob([this.authenticationKey.buffer.slice(0) as ArrayBuffer])
        : null,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch passwords: ${response.status}`);
    }

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
    const salt = this.textEncoder.encode(username);
    const importedPassword = await crypto.subtle.importKey(
      'raw',
      this.textEncoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: this.pbkdf2Iterations,
        hash: 'SHA-256',
      },
      importedPassword,
      this.derivedKeyLength * 8,
    );

    const derivedBytes = new Uint8Array(derivedBits);
    this.masterKey = await crypto.subtle.importKey(
      'raw',
      derivedBytes.slice(0, 32),
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
    this.authenticationKey = derivedBytes.slice(32);
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

    const response = await fetch(`${environment.serverUrl}/store`, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      method: 'POST',
      body: new Blob([authKeyAndData.buffer.slice(0) as ArrayBuffer]),
    });

    if (!response.ok) {
      throw new Error(`Failed to store passwords: ${response.status}`);
    }
  }

  private async encrypt(): Promise<Uint8Array> {
    if (this.masterKey === null) {
      return Promise.reject('master key is null');
    }

    const compressed = gzipSync(strToU8(JSON.stringify([...this.passwords])));
    const plaintext = compressed.buffer.slice(
      compressed.byteOffset,
      compressed.byteOffset + compressed.byteLength,
    ) as ArrayBuffer;

    const initializationVector = new Uint8Array(this.ivLen);
    crypto.getRandomValues(initializationVector);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: initializationVector,
      },
      this.masterKey,
      plaintext,
    );

    return this.concatUint8Array(initializationVector, new Uint8Array(encrypted));
  }

  private async decrypt(buffer: ArrayBuffer): Promise<void> {
    if (this.masterKey === null) {
      return Promise.reject('master key is null');
    }

    const iv = buffer.slice(0, this.ivLen);
    const data = buffer.slice(this.ivLen);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      this.masterKey,
      data,
    );

    const uncompressed = strFromU8(gunzipSync(new Uint8Array(decrypted)));
    this.passwords = new Map(JSON.parse(uncompressed));
  }
}
