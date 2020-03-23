import {isPlatformBrowser} from '@angular/common';
import {APP_INITIALIZER, ApplicationRef, Injector, ModuleWithProviders, NgModule, PLATFORM_ID} from '@angular/core';
import {filter, take} from 'rxjs/operators';

// https://github.com/angular/angular/blob/master/packages/service-worker/src/module.ts
/**
 * Token that can be used to provide options for `ServiceWorkerModule` outside of
 * `ServiceWorkerModule.register()`.
 */
export abstract class SwRegistrationOptions {
  /**
   * Path to service worker file
   */
  script: string;

  /**
   * Whether the ServiceWorker will be registered.
   * Default: true
   */
  enabled?: boolean;

  /**
   * A URL that defines the ServiceWorker's registration scope; that is, what range of URLs it can
   * control. It will be used when calling
   * [ServiceWorkerContainer#register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).
   */
  scope?: string;
}

export function swAppInitializer(
  injector: Injector, options: SwRegistrationOptions, platformId: string): () => void {
  const initializer = () => {
    if (!(isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
      options.enabled !== false)) {
      return;
    }

    const appRef = injector.get<ApplicationRef>(ApplicationRef);
    appRef.isStable.pipe(filter(stable => stable), take(1)).subscribe(
      () => navigator.serviceWorker.register(options.script, {scope: options.scope})
        .catch(err => console.error('Service worker registration failed with:', err)));

  };
  return initializer;
}

@NgModule()
export class ServiceWorkerModule {
  static register(opts: SwRegistrationOptions = {script: 'service-worker.js'}):
    ModuleWithProviders<ServiceWorkerModule> {
    return {
      ngModule: ServiceWorkerModule,
      providers: [
        {provide: SwRegistrationOptions, useValue: opts},
        {
          provide: APP_INITIALIZER,
          useFactory: swAppInitializer,
          deps: [Injector, SwRegistrationOptions, PLATFORM_ID],
          multi: true,
        },
      ],
    };
  }
}
