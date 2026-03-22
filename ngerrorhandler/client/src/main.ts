import {provideRouter, RouteReuseStrategy, Routes, withHashLocation} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {AppGlobalErrorHandler} from './app/app.global.errorhandler';
import {bootstrapApplication} from '@angular/platform-browser';
import {HomePage} from './app/home/home.page';
import {AppComponent} from './app/app.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage},
];


bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideIonicAngular(),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: ErrorHandler, useClass: AppGlobalErrorHandler},
    provideRouter(routes, withHashLocation())
  ]
})
  .catch(err => console.error(err));
