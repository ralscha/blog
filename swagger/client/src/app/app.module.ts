import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {HomePage} from './home/home.page';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {EditPage} from './edit/edit.page';
import {ApiModule, Configuration, ConfigurationParameters} from './swagger';
import {environment} from '../environments/environment';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage},
  {path: 'edit', component: EditPage},
  {path: '**', redirectTo: 'home'}
];

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: environment.basePath
  };
  return new Configuration(params);
}

@NgModule({ declarations: [AppComponent, HomePage, EditPage],
    bootstrap: [AppComponent], imports: [BrowserModule,
        CommonModule,
        ApiModule.forRoot(apiConfigFactory),
        FormsModule,
        IonicModule.forRoot(),
        RouterModule.forRoot(routes, { useHash: true })], providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {
}
