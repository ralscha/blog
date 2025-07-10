import {provideRouter, RouteReuseStrategy, Routes, withHashLocation} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {bootstrapApplication} from '@angular/platform-browser';
import {HomePage} from './app/home/home.page';
import {inject} from '@angular/core';
import {AuthGuard} from './app/auth-guard.service';
import {LoginPage} from './app/login/login.page';
import {EditPage} from './app/edit/edit.page';
import {AppComponent} from './app/app.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path: 'login', component: LoginPage},
  {path: 'edit', component: EditPage, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path: 'edit/:id', component: EditPage, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path: '**', redirectTo: '/home'}
];


bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withHashLocation())
  ]
})
  .catch(err => console.error(err));
