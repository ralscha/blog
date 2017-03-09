import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {SignupPage} from "../pages/signup/signup";
import {CustomFormsModule} from 'ng2-validation'
import {Storage, IonicStorageModule} from "@ionic/storage";
import {AuthService} from "../providers/auth-service";
import {JwtHelper, AuthModule, AuthConfig} from "angular2-jwt";

const storage = new Storage();
const authConfig = new AuthConfig({tokenGetter: (() => storage.get('jwt'))});

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    CustomFormsModule,
    AuthModule.forRoot(authConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    JwtHelper]
})
export class AppModule {
}
