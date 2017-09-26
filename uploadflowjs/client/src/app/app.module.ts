import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {ProgressBarComponent} from "../components/progress-bar/progress-bar";
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {
}
