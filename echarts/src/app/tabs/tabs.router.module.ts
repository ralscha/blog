import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';
import {Chart1Page} from '../chart1/chart1';
import {Chart3Page} from '../chart3/chart3';
import {Chart2Page} from '../chart2/chart2';
import {Chart4Page} from '../chart4/chart4';
import {Chart5Page} from '../chart5/chart5';
import {Chart6Page} from '../chart6/chart6';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'chart1',
        children: [
          {
            path: '',
            component: Chart1Page
          }
        ]
      },
      {
        path: 'chart2',
        children: [
          {
            path: '',
            component: Chart2Page
          }
        ]
      },
      {
        path: 'chart3',
        children: [
          {
            path: '',
            component: Chart3Page
          }
        ]
      },
      {
        path: 'chart4',
        children: [
          {
            path: '',
            component: Chart4Page
          }
        ]
      },
      {
        path: 'chart5',
        children: [
          {
            path: '',
            component: Chart5Page
          }
        ]
      },
      {
        path: 'chart6',
        children: [
          {
            path: '',
            component: Chart6Page
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/chart1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/chart1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
