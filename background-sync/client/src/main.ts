import {PreloadAllModules, provideRouter, RouteReuseStrategy, withHashLocation, withPreloading} from '@angular/router';
import {bootstrapApplication} from '@angular/platform-browser';
import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {provideIonicAngular,IonicRouteStrategy} from "@ionic/angular/standalone";
import {Workbox} from "workbox-window";

function loadServiceWorker() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('service-worker.js');
    wb.register();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideRouter(routes, withHashLocation(), withPreloading(PreloadAllModules))
  ]
})
  .then(() => loadServiceWorker())
  .catch(err => console.error(err));
