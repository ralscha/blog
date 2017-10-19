import {Component} from '@angular/core';

@Component({
  selector: 'page-chart3',
  templateUrl: 'chart3.html'
})
export class Chart3Page {
  private chart = null;
  private running = false;
  private interval = null;

  chartOption = {
    series: [{
      type: 'gauge',
      detail: {formatter: '{value}%'},
      data: [{value: 50, name: 'Sensor'}]
    }]
  };

  onChartInit(ec) {
    this.chart = ec;
  }

  start() {
    this.running = true;
    this.interval = setInterval(() => {
      this.chartOption.series[0].data[0].value = Number((Math.random() * 100).toFixed(1));
      this.chart.setOption(this.chartOption, true);
    }, 2000);
  }

  stop() {
    this.running = false;
    clearInterval(this.interval);
  }

}
