import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {HttpModule} from "@angular/http";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { EarthquakeProvider } from '../providers/earthquake/earthquake';
import {DetailComponent} from "../pages/home/detail";
import {FilterPopover} from "../pages/home/filter";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailComponent,
    FilterPopover
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
    FilterPopover
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EarthquakeProvider
  ]
})
export class AppModule {}
