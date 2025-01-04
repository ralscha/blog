import {Component} from '@angular/core';
import {ViewWillEnter, ViewWillLeave} from '@ionic/angular';
import {EChartsOption} from 'echarts';

type DataType = { name: string, value: [string, number] };

@Component({
    templateUrl: 'chart6.html',
    styleUrls: ['chart6.scss'],
    standalone: false
})
export class Chart6Page implements ViewWillEnter, ViewWillLeave {
  private static oneDay = 24 * 3600 * 1000;

  data1: DataType[] = [];
  data2: DataType[] = [];
  updateOptions1!: { series: { data: DataType[] }[] };
  updateOptions2!: { series: { data: DataType[] }[] };
  options1: EChartsOption = {
    title: {
      text: 'Dynamic Data 1'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
          const param = params[0];
          const date = new Date(param.name);
          return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + param.value[1];
      },
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      }
    },
    series: [{
      name: 'Sumulation Data',
      type: 'line',
      showSymbol: false,
      data: this.data1
    }]
  };
  options2: EChartsOption = {
    title: {
      text: 'Dynamic Data 2'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const param = params[0];
        const date = new Date(param.name);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + param.value[1];
      },
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      }
    },
    series: [{
      name: 'Sumulation Data',
      type: 'line',
      showSymbol: false,
      data: this.data2
    }]
  };
  private now = new Date(2017, 9, 3);
  private value = Math.random() * 1000;
  private randomDataInterval!: number;

  constructor() {
    for (let i = 0; i < 1000; i++) {
      this.data1.push(this.randomData());
      this.data2.push(this.randomData());
    }
  }

  ionViewWillEnter(): void {
    this.randomDataInterval = window.setInterval(() => {
      for (let i = 0; i < 5; i++) {
        this.data1.shift();
        this.data1.push(this.randomData());
        this.data2.shift();
        this.data2.push(this.randomData());
      }

      this.updateOptions1 = {
        series: [{
          data: this.data1
        }]
      };

      this.updateOptions2 = {
        series: [{
          data: this.data2
        }]
      };
    }, 1000);
  }

  ionViewWillLeave(): void {
    clearInterval(this.randomDataInterval);
  }

  private randomData(): DataType {
    this.now = new Date(+this.now + Chart6Page.oneDay);
    this.value = this.value + Math.random() * 21 - 10;
    return {
      name: this.now.toString(),
      value: [
        [this.now.getFullYear(), this.now.getMonth() + 1, this.now.getDate()].join('/'),
        Math.round(this.value)
      ]
    };
  }

}
