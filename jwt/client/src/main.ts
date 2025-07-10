import {provideRouter, RouteReuseStrategy, Routes, withHashLocation} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {bootstrapApplication} from '@angular/platform-browser';
import {JwtModule} from '@auth0/angular-jwt';
import {environment} from './environments/environment';
import {HomePage} from './app/home/home.page';
import {importProvidersFrom, inject} from '@angular/core';
import {AuthGuard} from './app/auth.guard';
import {LoginPage} from './app/login/login.page';
import {SignupPage} from './app/signup/signup.page';
import {AppComponent} from './app/app.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path: 'login', component: LoginPage},
  {path: 'signup', component: SignupPage},
  {path: '**', redirectTo: '/home'}
];

export function tokenGetter(): string | null {
  return localStorage.getItem('jwt_token');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    importProvidersFrom(JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.allowedDomains
      }
    })),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withHashLocation())
  ]
})
  .catch(err => console.error(err));
