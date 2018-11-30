import {Component} from '@angular/core';

@Component({
  selector: 'page-chart3',
  templateUrl: 'chart3.html',
  styleUrls: ['chart3.scss']
})
export class Chart3Page {

  running = false;
  options = {
    series: [{
      type: 'gauge',
      detail: {formatter: '{value}%'},
      data: [{value: 50, name: 'Sensor'}]
    }]
  };
  datas: any = null;
  private interval = null;

  start() {
    this.running = true;
    this.interval = setInterval(() => {
      this.datas = {
        series: [{
          data: [{value: Number((Math.random() * 100).toFixed(1))}]
        }]
      };
    }, 2000);
  }

  stop() {
    this.running = false;
    clearInterval(this.interval);
  }

}
