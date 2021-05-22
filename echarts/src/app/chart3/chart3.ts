import {Component} from '@angular/core';
import {EChartsOption} from 'echarts';

@Component({
  templateUrl: 'chart3.html',
  styleUrls: ['chart3.scss']
})
export class Chart3Page {

  running = false;
  options: EChartsOption = {
    series: [{
      type: 'gauge',
      detail: {formatter: '{value}%'},
      data: [{value: 50, name: 'Sensor'}]
    }]
  };
  datas: EChartsOption = {};
  private interval: number | null = null;

  start(): void {
    this.running = true;
    this.interval = window.setInterval(() => {
      this.datas = {
        series: [{
          data: [{value: Number((Math.random() * 100).toFixed(1))}]
        }]
      };
    }, 2000);
  }

  stop(): void {
    this.running = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
