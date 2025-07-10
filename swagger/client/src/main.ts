import {provideRouter, RouteReuseStrategy, Routes, withHashLocation} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {bootstrapApplication} from '@angular/platform-browser';
import {ApiModule, Configuration, ConfigurationParameters} from './app/swagger';
import {environment} from './environments/environment';
import {HomePage} from './app/home/home.page';
import {EditPage} from './app/edit/edit.page';
import {AppComponent} from './app/app.component';
import {importProvidersFrom} from '@angular/core';


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage},
  {path: 'edit', component: EditPage},
  {path: '**', redirectTo: 'home'}
];

function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: environment.basePath
  };
  return new Configuration(params);
}


bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    importProvidersFrom(ApiModule.forRoot(apiConfigFactory)),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withHashLocation())
  ]
})
  .catch(err => console.error(err));
