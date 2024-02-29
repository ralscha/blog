import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgxEchartsModule} from 'ngx-echarts';

import * as echarts from 'echarts/core';
import {BarChart, GaugeChart, GraphChart, HeatmapChart, LineChart} from 'echarts/charts';
import {
  CalendarComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import 'echarts/theme/dark.js';

echarts.use(
  [GridComponent, BarChart, LineChart, GaugeChart, GraphChart, HeatmapChart, TitleComponent,
    TooltipComponent, LegendComponent, CalendarComponent, VisualMapComponent, CanvasRenderer]
);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgxEchartsModule.forRoot({echarts})],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
