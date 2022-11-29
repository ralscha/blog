import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {HomePage} from './home/home.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

const routes: Routes = [
  {path: '', component: HomePage}
];

@NgModule({
  declarations: [AppComponent, HomePage],
  imports: [BrowserModule,
    CommonModule,
    FormsModule, IonicModule.forRoot(), RouterModule.forRoot(routes, { useHash: true })],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
