import { provideZoneChangeDetection } from "@angular/core";
import {PreloadAllModules, provideRouter, RouteReuseStrategy, withHashLocation, withPreloading} from '@angular/router';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideEchartsCore} from 'ngx-echarts';

import * as echarts from 'echarts/core';
import {
  CalendarComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';
import {BarChart, GaugeChart, GraphChart, HeatmapChart, LineChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import {AppComponent} from './app/app.component';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {tabsRoutes} from './app/tabs/tabs.routes';


echarts.use([GridComponent, TitleComponent, TooltipComponent, LegendComponent, CalendarComponent, VisualMapComponent,
  BarChart, LineChart, GaugeChart, GraphChart, HeatmapChart, CanvasRenderer]);

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),provideRouter(tabsRoutes, withHashLocation(), withPreloading(PreloadAllModules)),
    provideIonicAngular(),
    provideEchartsCore({echarts}),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ]
})
  .catch(err => console.error(err));
