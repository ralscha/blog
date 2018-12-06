import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {HomePage} from './home/home.page';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {LoginPage} from './login/login.page';
import {SignupPage} from './signup/signup.page';
import {JwtModule} from '@auth0/angular-jwt';
import {environment} from '../environments/environment';
import {AuthGuard} from './auth.guard';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage, canActivate: [AuthGuard]},
  {path: 'login', component: LoginPage},
  {path: 'signup', component: SignupPage},
  {path: '**', redirectTo: '/home'}
];

export function tokenGetter() {
  return localStorage.getItem('jwt_token');
}

@NgModule({
  declarations: [AppComponent, HomePage, LoginPage, SignupPage],
  entryComponents: [],
  imports: [BrowserModule,
    CommonModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.whitelistedDomains
      }
    }),
    FormsModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(routes, {useHash: true})],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
