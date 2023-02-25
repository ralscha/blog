import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {Workbox} from 'workbox-window';

function loadServiceWorker(): void {
  // if (environment.production && ('serviceWorker' in navigator)) {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('service-worker.js');

    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        console.log('Service worker activated for the first time!');
      } else {
        console.log('Service worker activated!');
      }
    });

    wb.addEventListener('waiting', (event) => {
      console.log(`A new service worker has installed, but it can't activate` +
        `until all tabs running the current version have fully unloaded.`);
    });

    wb.addEventListener('installed', (event) => {
      if (!event.isUpdate) {
        console.log('Service worker installed for the first time');
      } else {
        console.log('Service worker installed');
      }
    });

    wb.register();
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => loadServiceWorker())
  .catch(err => console.error(err));
