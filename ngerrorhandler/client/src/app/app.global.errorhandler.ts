import {ErrorHandler, inject, Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {ClientErrorService} from './clientError.service';

interface NetworkInformationLike {
  downlink?: number;
  effectiveType?: string;
}

interface ErrorReport {
  ts: number;
  userAgent: {
    language: string;
    online: boolean;
    platform: string;
    userAgent: string;
    connectionDownlink?: number;
    connectionEffectiveType?: string;
  };
  stackTrace: ErrorStackFrame[];
}

interface ErrorStackFrame {
  fileName?: string;
  functionName?: string;
  lineNumber?: number;
  columnNumber?: number;
}

@Injectable()
export class AppGlobalErrorHandler implements ErrorHandler {
  private readonly clientErrorService = inject(ClientErrorService);

  private isRetryRunning = false;
  private retryDelayMinutes = 1;
  private retryTimerId: number | undefined;

  constructor() {
    void this.sendStoredErrors();
    window.addEventListener('online', () => {
      this.clearRetryTimer();
      void this.sendStoredErrors();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleError(error: any): Promise<void> {
    console.error(error);

    const body = JSON.stringify(this.createErrorReport(error));

    const wasOK = await this.sendError(body);
    if (!wasOK) {
      await this.clientErrorService.store(body);
      this.scheduleRetry();
    }
  }

  private async sendStoredErrors(): Promise<void> {
    if (this.isRetryRunning) {
      return;
    }

    this.isRetryRunning = true;
    const retry = async () => {
      const errors = await this.clientErrorService.getAll();
      if (errors.length === 0) {
        this.isRetryRunning = false;
        this.retryDelayMinutes = 1;
        return;
      }

      const wasOK = await this.sendError(errors.map(error => error.error));
      if (wasOK) {
        const deleteIds: number[] = [];
        for (const error of errors) {
          if (error.id !== undefined) {
            deleteIds.push(error.id);
          }
        }
        await this.clientErrorService.delete(deleteIds);
        this.isRetryRunning = false;
        this.retryDelayMinutes = 1;
        return;
      }

      this.isRetryRunning = false;
      this.scheduleRetry();
    };

    await retry();
  }

  private createErrorReport(error: unknown): ErrorReport {
    const connection = (navigator as Navigator & {
      connection?: NetworkInformationLike;
    }).connection;
    const applicationError = this.asError(error);

    return {
      ts: Date.now(),
      userAgent: {
        language: navigator.language,
        online: navigator.onLine,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        connectionDownlink: connection?.downlink,
        connectionEffectiveType: connection?.effectiveType
      },
      stackTrace: this.parseStackTrace(applicationError)
    };
  }

  private parseStackTrace(error: Error): ErrorStackFrame[] {
    if (!error.stack) {
      return [];
    }

    return error.stack
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !this.isErrorHeaderLine(line))
      .map(line => this.parseStackFrame(line))
      .filter((frame): frame is ErrorStackFrame => frame !== null);
  }

  private isErrorHeaderLine(line: string): boolean {
    return !line.startsWith('at ') && !line.includes('@');
  }

  private parseStackFrame(line: string): ErrorStackFrame | null {
    return this.parseV8StackFrame(line) ?? this.parseFirefoxStackFrame(line);
  }

  private parseV8StackFrame(line: string): ErrorStackFrame | null {
    const withFunctionMatch = /^at\s+(.*?)\s+\((.+):(\d+):(\d+)\)$/.exec(line);
    if (withFunctionMatch) {
      const [, functionName, fileName, lineNumber, columnNumber] = withFunctionMatch;
      return {
        functionName,
        fileName,
        lineNumber: Number(lineNumber),
        columnNumber: Number(columnNumber)
      };
    }

    const withoutFunctionMatch = /^at\s+(.+):(\d+):(\d+)$/.exec(line);
    if (withoutFunctionMatch) {
      const [, fileName, lineNumber, columnNumber] = withoutFunctionMatch;
      return {
        fileName,
        lineNumber: Number(lineNumber),
        columnNumber: Number(columnNumber)
      };
    }

    return null;
  }

  private parseFirefoxStackFrame(line: string): ErrorStackFrame | null {
    const withFunctionMatch = /^(.*?)@(.+):(\d+):(\d+)$/.exec(line);
    if (withFunctionMatch) {
      const [, functionName, fileName, lineNumber, columnNumber] = withFunctionMatch;
      return {
        functionName: functionName || undefined,
        fileName,
        lineNumber: Number(lineNumber),
        columnNumber: Number(columnNumber)
      };
    }

    return null;
  }

  private asError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string') {
      return new Error(error);
    }

    return new Error('Unexpected application error');
  }

  private scheduleRetry(): void {
    if (this.retryTimerId !== undefined) {
      return;
    }

    const delayMinutes = this.retryDelayMinutes;
    this.retryTimerId = window.setTimeout(() => {
      this.retryTimerId = undefined;
      void this.sendStoredErrors();
    }, delayMinutes * 60_000);

    if (this.retryDelayMinutes < 32) {
      this.retryDelayMinutes = Math.min(this.retryDelayMinutes * 2, 32);
    }
  }

  private clearRetryTimer(): void {
    if (this.retryTimerId !== undefined) {
      window.clearTimeout(this.retryTimerId);
      this.retryTimerId = undefined;
    }
  }

  private async sendError(errors: string[] | string): Promise<boolean> {
    try {
      const body = Array.isArray(errors) ? `[${errors.join(',')}]` : `[${errors}]`;

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

    return false;
  }
}
