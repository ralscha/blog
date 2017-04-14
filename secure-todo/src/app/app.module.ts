import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {SplashScreen} from '@ionic-native/splash-screen';
import {EditPage} from "../pages/edit/edit";
import {IonicStorageModule} from "@ionic/storage";
import {TodoService} from "../providers/todo-service";
import {PasswordPage} from "../pages/password/password";
import {StatusBar} from "@ionic-native/status-bar";

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
    TodoService]
})
export class AppModule {
}
