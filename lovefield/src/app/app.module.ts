import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {EarthquakeService} from "../providers/earthquake-service";
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
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FilterPopover
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, EarthquakeService]
})
export class AppModule {
}
