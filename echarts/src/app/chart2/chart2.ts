import {Component} from '@angular/core';
import {EChartsOption} from 'echarts';
import {NgxEchartsDirective} from 'ngx-echarts';
import {IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-chart2',
  templateUrl: 'chart2.html',
  styleUrl: './chart2.scss',
  imports: [NgxEchartsDirective, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class Chart2Page {

  options: EChartsOption = {
    legend: {
      data: ['Profit', 'Expenses', 'Income']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value'
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: {show: false},
        data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }
    ],
    series: [
      {
        name: 'Profit',
        type: 'bar',
        label: {
          show: true,
          position: 'inside'
        },
        data: [200, 170, 240, 244, 200, 220, 210]
      },
      {
        name: 'Income',
        type: 'bar',
        stack: 'Total',
        label: {
          show: true
        },
        data: [320, 302, 341, 374, 390, 450, 420]
      },
      {
        name: 'Expenses',
        type: 'bar',
        stack: 'Total',
        label: {
          show: true,
          position: 'left'
        },
        data: [-120, -132, -101, -134, -190, -230, -210]
      }
    ]
  };
}
