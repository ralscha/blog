import {Workbox} from 'workbox-window';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';

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

bootstrapApplication(AppComponent, {
  providers: []
})
  .then(() => loadServiceWorker())
  .catch(err => console.error(err));
