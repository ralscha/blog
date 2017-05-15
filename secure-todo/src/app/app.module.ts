import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {EditPage} from "../pages/edit/edit";
import {IonicStorageModule} from "@ionic/storage";
import {PasswordPage} from "../pages/password/password";
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {TodoProvider} from "../providers/todo/todo";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditPage,
    PasswordPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({name: 'todo', driverOrder: ['sqlite', 'indexeddb']})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EditPage,
    PasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TodoProvider
  ]
})
export class AppModule {
}
