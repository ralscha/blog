import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

function loadServiceWorker() {
  // if (environment.production && ('serviceWorker' in navigator)) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .catch(err => console.error('Service worker registration failed with:', err));
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(module => loadServiceWorker())
  .catch(err => console.error(err));
