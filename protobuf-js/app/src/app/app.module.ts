import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {TabsPage} from '../pages/tabs/tabs';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {DetailComponent} from '../components/detail/detail';
import {EarthquakeProvider} from '../providers/earthquake/earthquake';
import {JsonPage} from "../pages/json/json";
import {ProtobufPage} from "../pages/protobuf/protobuf";
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
    EarthquakeProvider
  ]
})
export class AppModule {
}
