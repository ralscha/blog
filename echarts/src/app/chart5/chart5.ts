import {Component} from '@angular/core';
import format from 'date-fns/format'

@Component({
  templateUrl: 'chart5.html',
  styleUrls: ['chart5.scss']
})
export class Chart5Page {

  options = {
    tooltip: {
      position: 'top',
      formatter: p => p.data[0] + ': ' + p.data[1]
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

  private getVirtulData(year) {
    year = year || '2017';
    const date = new Date(year, 0, 1).getTime();
    const end = new Date(year, 11, 31).getTime();
    const dayTime = 3600 * 24 * 1000;
    const data = [];
    for (let time = date; time <= end; time += dayTime) {
      data.push([
        format(time, 'yyyy-MM-dd'),
        Math.floor(Math.random() * 1000)
      ]);
    }
    return data;
  }

}
