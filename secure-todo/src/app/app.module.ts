import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {EditPage} from "../pages/edit/edit";
import {Storage} from "@ionic/storage";
import {TodoService} from "../providers/todo-service";
import {PasswordPage} from "../pages/password/password";

export function provideStorage() {
  return new Storage(['sqlite', 'indexeddb'], {name: 'todo'});
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditPage,
    PasswordPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
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
    {provide: Storage, useFactory: provideStorage},
    TodoService]
})
export class AppModule {
}
