import {Component} from '@angular/core';
import {EChartsOption} from 'echarts';
import {NgxEchartsDirective} from 'ngx-echarts';
import {IonButton, IonContent, IonFooter, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-chart3',
  templateUrl: 'chart3.html',
  styleUrl: './chart3.scss',
  imports: [NgxEchartsDirective, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton]
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
