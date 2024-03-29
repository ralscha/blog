import {inject, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {HomePage} from './home/home.page';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PasswordPage} from './password/password.page';
import {AuthGuard} from './auth.guard';
import {EditPage} from './edit/edit.page';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path: 'password', component: PasswordPage},
  {path: 'edit', component: EditPage, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path: 'edit/:id', component: EditPage, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  declarations: [AppComponent, HomePage, PasswordPage, EditPage],
  imports: [BrowserModule,
    CommonModule,
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
