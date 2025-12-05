import { provideZoneChangeDetection } from "@angular/core";
import {PreloadAllModules, provideRouter, RouteReuseStrategy, withHashLocation, withPreloading} from '@angular/router';
import {bootstrapApplication} from '@angular/platform-browser';
import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {provideServiceWorker} from "@angular/service-worker";
import {environment} from "./environments/environment";


bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),provideIonicAngular(),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideRouter(routes, withHashLocation(), withPreloading(PreloadAllModules)),
    provideServiceWorker(environment.serviceWorkerScript)
  ]
})
  .catch(err => console.error(err));
