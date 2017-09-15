import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {EarthquakeProvider} from '../providers/earthquake/earthquake';
import {DetailComponent} from "../pages/home/detail";
import {FilterPage} from "../pages/home/filter";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailComponent,
    FilterPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FilterPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EarthquakeProvider
  ]
})
export class AppModule {
}
