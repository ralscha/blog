import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

function loadServiceWorker(): void {
  // if (environment.production && ('serviceWorker' in navigator)) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .catch(err => console.error('Service worker registration failed with:', err));
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => loadServiceWorker())
  .catch(err => console.error(err));
