import {Component, ViewChild} from '@angular/core';
import {EChartsComponent} from "../../components/echart-component";
import * as echarts from 'echarts/dist/echarts-en.js';

@Component({
  selector: 'page-chart5',
  templateUrl: 'chart5.html'
})
export class Chart5Page {

  @ViewChild(EChartsComponent)
  chart;

  ionViewDidEnter() {
    this.chart.resize();
  }

  private getVirtulData(year) {
    year = year || '2017';
    var date = +echarts.number.parseDate(year + '-01-01');
    var end = +echarts.number.parseDate((+year + 1) + '-01-01');
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (var time = date; time < end; time += dayTime) {
      data.push([
        echarts.format.formatTime('yyyy-MM-dd', time),
        Math.floor(Math.random() * 1000)
      ]);
    }
    return data;
  }

  option = {
    tooltip: {
      position: 'top',
      formatter: function (p) {
        const format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
        return format + ': ' + p.data[1];
      }
    },
    visualMap: {
      min: 0,
      max: 1000,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
    },

    calendar: [{
      cellSize: [10, 'auto'],
      bottom: 45,
      orient: 'vertical',
      range: '2017',
      dayLabel: {
        margin: 5
      }
    }, {
      left: 250,
      cellSize: [10, 'auto'],
      bottom: 45,
      orient: 'vertical',
      range: '2018',
      dayLabel: {
        margin: 5
      }
    }],

    series: [{
      type: 'heatmap',
      coordinateSystem: 'calendar',
      calendarIndex: 0,
      data: this.getVirtulData(2017)
    }, {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      calendarIndex: 1,
      data: this.getVirtulData(2018)
    }]
  };

}
