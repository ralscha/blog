import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {EditPage} from "../pages/edit/edit";
import {HttpClientModule} from "@angular/common/http";
import {ApiModule} from "../swagger/api.module";
import {Configuration, ConfigurationParameters} from "../swagger";

export function apiConfigFactory (): Configuration {
  const params: ConfigurationParameters = {
    basePath: 'http://localhost:8080'
  }
  return new Configuration(params);
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApiModule.forRoot(apiConfigFactory),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EditPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {
}
