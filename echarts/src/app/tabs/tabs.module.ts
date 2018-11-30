import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabsPageRoutingModule} from './tabs.router.module';
import {TabsPage} from './tabs.page';
import {Chart1Page} from '../chart1/chart1';
import {Chart2Page} from '../chart2/chart2';
import {Chart3Page} from '../chart3/chart3';
import {Chart4Page} from '../chart4/chart4';
import {Chart5Page} from '../chart5/chart5';
import {Chart6Page} from '../chart6/chart6';
import {NgxEchartsModule} from 'ngx-echarts';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    NgxEchartsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage, Chart1Page, Chart2Page, Chart3Page, Chart4Page, Chart5Page, Chart6Page]
})
export class TabsPageModule {
}
