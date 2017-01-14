import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {TabsPage} from '../pages/tabs/tabs';
import {JsonPage} from "../pages/json/json";
import {ProtobufPage} from "../pages/protobuf/protobuf";
import {EarthquakeService} from "../providers/earthquake";
import {DetailComponent} from "../components/detail/detail";

@NgModule({
  declarations: [
    MyApp,
    JsonPage,
    ProtobufPage,
    TabsPage,
    DetailComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    JsonPage,
    ProtobufPage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, EarthquakeService]
})
export class AppModule {
}
