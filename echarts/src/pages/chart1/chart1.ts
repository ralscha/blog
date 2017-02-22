import {Component, ViewChild} from '@angular/core';
import {EChartsComponent} from "../../components/echart-component";

@Component({
  selector: 'page-chart1',
  templateUrl: 'chart1.html'
})
export class Chart1Page {

  @ViewChild(EChartsComponent)
  chart;

  ionViewDidEnter() {
    this.chart.resize();
  }

  option = {
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
