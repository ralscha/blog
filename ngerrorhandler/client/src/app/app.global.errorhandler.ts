import {ErrorHandler, Injectable} from '@angular/core';
import * as StackTrace from 'stacktrace-js';
import {environment} from '../environments/environment';
import {ClientErrorService} from './clientError.service';

@Injectable()
export class AppGlobalErrorhandler implements ErrorHandler {

  private isRetryRunning = false;

  constructor(private readonly clientErrorService: ClientErrorService) {
    this.sendStoredErrors();
    window.addEventListener('online', () => this.sendStoredErrors());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleError(error: any): Promise<void> {
    console.error(error);

    // @ts-ignore
    const connection = navigator.connection;

    const userAgent = {
      language: navigator.language,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      connectionType: connection?.type,
    };
    const stackTrace = await StackTrace.fromError(error, {offline: true});
    const body = JSON.stringify({ts: Date.now(), userAgent, stackTrace});

    const wasOK = await this.sendError(body);
    if (!wasOK) {
      await this.clientErrorService.store(body);
      setTimeout(() => this.sendStoredErrors(), 60_000);
    }

  }

  private async sendStoredErrors(): Promise<void> {
    if (this.isRetryRunning) {
      return;
    }

    let attempts = 1;
    const retry = async () => {
      const errors = await this.clientErrorService.getAll();
      if (errors.length === 0) {
        return;
      }

      const wasOK = await this.sendError(errors.map(error => error.error));
      if (wasOK) {
        const deleteIds: string[] = [];
        for (const error of errors) {
          if (error.id) {
            deleteIds.push(String(error.id));
          }
        }
        await this.clientErrorService.delete(deleteIds);
        this.isRetryRunning = false;
        return;
      }

      this.isRetryRunning = true;
      if (attempts < 32) {
        attempts = attempts * 2;
      }
      setTimeout(retry, attempts * 60_000);
    };

    await retry();
  }

  private async sendError(errors: string[] | string): Promise<boolean> {
    if (navigator.onLine) {
      try {

        let body;
        if (Array.isArray(errors)) {
          body = `[${errors.join(',')}]`;
        } else {
          body = `[${errors}]`;
        }

        const response = await fetch(`${environment.serverURL}/clientError`, {
          method: 'POST',
          body,
          headers: {
            'content-type': 'application/json'
          }
        });
        if (response.ok) {
          return true;
        }
      } catch (error) {
        console.log(error);
      }
    }

    return false;
  }

}
