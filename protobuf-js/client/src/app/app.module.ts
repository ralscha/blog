import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {TabsPage} from './tabs/tabs.page';
import {JsonPage} from './json/json.page';
import {ProtobufPage} from './protobuf/protobuf.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {DetailComponent} from './detail/detail.component';


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

@NgModule({ declarations: [AppComponent, TabsPage, ProtobufPage, JsonPage, DetailComponent],
    bootstrap: [AppComponent], imports: [BrowserModule, IonicModule.forRoot(), RouterModule.forRoot(routes, { useHash: true })], providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {
}
