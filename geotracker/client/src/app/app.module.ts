import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {LocationTrackerProvider} from '../providers/location-tracker/location-tracker';
import {ServerPushProvider} from '../providers/server-push/server-push';
import {HttpClientModule} from "@angular/common/http";
import {Geolocation} from "@ionic-native/geolocation";

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocationTrackerProvider,
    ServerPushProvider
  ]
})
export class AppModule {
}
