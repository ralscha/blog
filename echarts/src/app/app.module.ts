import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {TabsPage} from '../pages/tabs/tabs';
import {Chart1Page} from "../pages/chart1/chart1";
import {Chart2Page} from "../pages/chart2/chart2";
import {Chart3Page} from "../pages/chart3/chart3";
import {EChartsComponent} from "../components/echart-component";
import {Chart4Page} from "../pages/chart4/chart4";

@NgModule({
  declarations: [
    MyApp,
    Chart1Page,
    Chart2Page,
    Chart3Page,
    Chart4Page,
    TabsPage,
    EChartsComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Chart1Page,
    Chart2Page,
    Chart3Page,
    Chart4Page,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {
}
