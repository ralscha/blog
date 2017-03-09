import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {EditPage} from "../pages/edit/edit";
import {IonicStorageModule} from "@ionic/storage";
import {TodoService} from "../providers/todo-service";
import {PasswordPage} from "../pages/password/password";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditPage,
    PasswordPage
  ],
  imports: [
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TodoService]
})
export class AppModule {
}
