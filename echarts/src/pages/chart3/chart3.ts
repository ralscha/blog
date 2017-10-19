import {Component} from '@angular/core';

@Component({
  selector: 'page-chart3',
  templateUrl: 'chart3.html'
})
export class Chart3Page {

  private running = false;
  private interval = null;

  options: any = {
    series: [{
      type: 'gauge',
      detail: {formatter: '{value}%'},
      data: [{value: 50, name: 'Sensor'}]
    }]
  };

  datas: any = null;

  start() {
    this.running = true;
    this.interval = setInterval(() => {
      this.datas = [{value: Number((Math.random() * 100).toFixed(1)), name: 'Sensor'}];
    }, 2000);
  }

  stop() {
    this.running = false;
    clearInterval(this.interval);
  }

}
