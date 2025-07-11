import {Component} from '@angular/core';
import {EChartsOption} from 'echarts';
import {NgxEchartsDirective} from 'ngx-echarts';
import {IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-chart1',
  templateUrl: 'chart1.html',
  styleUrl: './chart1.scss',
  imports: [NgxEchartsDirective, IonHeader, IonToolbar, IonContent, IonTitle]
})
export class Chart1Page {

  options: EChartsOption = {
    color: ['#3398DB'],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Test',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220]
      }
    ]
  };

}
