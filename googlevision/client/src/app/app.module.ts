import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {HomePage} from './home/home.page';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm-preview/core';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePage},
];

@NgModule({
  declarations: [AppComponent, HomePage],
  entryComponents: [],
  imports: [BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAZjJ216B4aJGdXTwXNevmXesob9RUSlPc'
    }),
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(routes, {useHash: true})],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
