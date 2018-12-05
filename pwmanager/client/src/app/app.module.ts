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
import {EditPage} from './edit/edit.page';
import {AuthGuard} from './auth-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage, canActivate: [AuthGuard]},
  {path: 'login', component: LoginPage},
  {path: 'edit', component: EditPage, canActivate: [AuthGuard]},
  {path: 'edit/:id', component: EditPage, canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  declarations: [AppComponent, HomePage, LoginPage, EditPage],
  entryComponents: [],
  imports: [BrowserModule,
    CommonModule,
    HttpClientModule,
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
