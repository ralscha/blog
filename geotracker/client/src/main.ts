import {StatusBar} from '@ionic-native/status-bar/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  Routes,
  withHashLocation,
  withPreloading
} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {HomePage} from "./app/home/home.page";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage}
];

bootstrapApplication(AppComponent, {
  providers: [
    StatusBar,
    SplashScreen,
    provideRouter(routes, withHashLocation(), withPreloading(PreloadAllModules)),
    provideIonicAngular(),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .catch(err => console.error(err));
