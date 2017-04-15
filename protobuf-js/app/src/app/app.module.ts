/// <reference path="../../node_modules/protobufjs/stub-long.d.ts" />

import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {TabsPage} from '../pages/tabs/tabs';
import {JsonPage} from "../pages/json/json";
import {ProtobufPage} from "../pages/protobuf/protobuf";
import {EarthquakeService} from "../providers/earthquake";
import {DetailComponent} from "../components/detail/detail";
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpModule} from "@angular/http";

@NgModule({
  declarations: [
    MyApp,
    JsonPage,
    ProtobufPage,
    TabsPage,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    JsonPage,
    ProtobufPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EarthquakeService]
})
export class AppModule {
}
