import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {PasswordProvider} from "../providers/password/password";
import {EditPage} from "../pages/edit/edit";
import {LoginPage} from "../pages/login/login";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EditPage,
    LoginPage
  ],
  providers: [
    PasswordProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
