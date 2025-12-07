import { provideZoneChangeDetection } from "@angular/core";
import {provideRouter, RouteReuseStrategy, Routes, withHashLocation} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {bootstrapApplication} from '@angular/platform-browser';
import {HomePage} from './app/home/home.page';
import {AppComponent} from './app/app.component';

const routes: Routes = [
  {path: '', component: HomePage}
];


bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),provideIonicAngular(),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideRouter(routes, withHashLocation())
  ]
})
  .catch(err => console.error(err));
