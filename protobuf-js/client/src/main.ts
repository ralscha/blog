import { provideZoneChangeDetection } from "@angular/core";
import {provideRouter, RouteReuseStrategy, Routes, withHashLocation} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {bootstrapApplication} from '@angular/platform-browser';
import {TabsPage} from './app/tabs/tabs.page';
import {JsonPage} from './app/json/json.page';
import {ProtobufPage} from './app/protobuf/protobuf.page';
import {AppComponent} from './app/app.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'json',
        children: [{
          path: '',
          component: JsonPage
        }]
      },
      {
        path: 'protobuf',
        children: [{
          path: '',
          component: ProtobufPage
        }]
      },
      {
        path: '',
        redirectTo: '/tabs/json',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/json',
    pathMatch: 'full'
  }
];


bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),provideIonicAngular(),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withHashLocation())
  ]
})
  .catch(err => console.error(err));
