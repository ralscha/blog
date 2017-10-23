import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {TabsPage} from '../pages/tabs/tabs';
import {Chart1Page} from "../pages/chart1/chart1";
import {Chart2Page} from "../pages/chart2/chart2";
import {Chart3Page} from "../pages/chart3/chart3";
import {Chart4Page} from "../pages/chart4/chart4";
import {Chart5Page} from "../pages/chart5/chart5";
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {AngularEchartsModule} from "ngx-echarts";

@NgModule({
  declarations: [
    MyApp,
    Chart1Page,
    Chart2Page,
    Chart3Page,
    Chart4Page,
    Chart5Page,
    TabsPage
  ],
  imports: [
    BrowserModule,
    AngularEchartsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Chart1Page,
    Chart2Page,
    Chart3Page,
    Chart4Page,
    Chart5Page,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
