import {Component, ViewChild} from '@angular/core';
import {EChartsComponent} from "../../components/echart-component";

@Component({
  selector: 'page-chart3',
  templateUrl: 'chart3.html'
})
export class Chart3Page {
  @ViewChild(EChartsComponent)
  chart;

  running = false;
  interval = null;

  option = {
    series: [{
      type: 'gauge',
      detail: {formatter: '{value}%'},
      data: [{value: 50, name: 'Sensor'}]
    }]
  };

  ionViewDidEnter() {
    this.chart.resize();
  }

  start() {
    this.running = true;
    this.interval = setInterval(() => {
      this.option.series[0].data[0].value = Number((Math.random() * 100).toFixed(1));
      this.chart.setOption(this.option, true);
    }, 2000);
  }

  stop() {
    this.running = false;
    clearInterval(this.interval);
  }

}
