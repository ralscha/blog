import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';

function loadServiceWorker(): void {
  // if (environment.production && ('serviceWorker' in navigator)) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .catch(err => console.error('Service worker registration failed with:', err));
  }
}

bootstrapApplication(AppComponent, {
  providers: []
})
  .then(() => loadServiceWorker())
  .catch(err => console.error(err));
