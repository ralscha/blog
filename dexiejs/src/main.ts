import { provideZoneChangeDetection } from "@angular/core";
import {provideRouter, RouteReuseStrategy, Routes, withHashLocation} from '@angular/router';
import {bootstrapApplication} from '@angular/platform-browser';
import {HomePage} from './app/home/home.page';
import {AppComponent} from './app/app.component';
import {IonicRouteStrategy, provideIonicAngular} from "@ionic/angular/standalone";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage}
];


bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),provideIonicAngular(),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideRouter(routes, withHashLocation())
  ]
})
  .catch(err => console.error(err));
