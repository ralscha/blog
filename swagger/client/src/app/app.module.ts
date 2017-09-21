import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {EditPage} from "../pages/edit/edit";
import {HttpModule} from "@angular/http";
import {TodoserviceApi} from "../swagger/api/TodoserviceApi";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EditPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TodoserviceApi
  ]
})

export class AppModule {
}
