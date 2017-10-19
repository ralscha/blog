import {Component, Input, ViewChild, OnInit, OnDestroy} from '@angular/core';
import * as echarts from 'echarts/dist/echarts-en.js';

@Component({
  selector: 'echart',
  template: `<div #root></div>`
})
export class EChartsComponent implements OnInit, OnDestroy {

  @Input('option')
  option: object;

  private chart: any;

  @ViewChild('root')
  private root;

  resizeListener = () => this.resize();

  ngOnInit(): void {
    this.chart = echarts.init(this.root.nativeElement);
    this.chart.setOption(this.option);
    window.addEventListener('resize', this.resizeListener, true);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener, true);
    this.chart.resize();
  }

  setOption(option, notMerge) {
    this.chart.setOption(option, notMerge);
  }

  resize() {
    this.chart.resize();
  }

}
