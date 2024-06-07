import {inject, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {HomePage} from './home/home.page';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {LoginPage} from './login/login.page';
import {EditPage} from './edit/edit.page';
import {AuthGuard} from './auth-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path: 'login', component: LoginPage},
  {path: 'edit', component: EditPage, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path: 'edit/:id', component: EditPage, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path: '**', redirectTo: '/home'}
];

@NgModule({ declarations: [AppComponent, HomePage, LoginPage, EditPage],
    bootstrap: [AppComponent], imports: [BrowserModule,
        CommonModule,
        FormsModule,
        IonicModule.forRoot(),
        RouterModule.forRoot(routes, { useHash: true })], providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {
}
