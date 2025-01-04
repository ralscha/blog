import {Component} from '@angular/core';
import {EChartsOption} from 'echarts';


@Component({
    templateUrl: 'chart4.html',
    styleUrls: ['chart4.scss'],
    standalone: false
})
export class Chart4Page {

  options: EChartsOption = {
    title: {
      text: 'Graph Example'
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 50,
        roam: true,
        label: {
            show: true
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        data: [{
          name: 'Node 1',
          x: 300,
          y: 300
        }, {
          name: 'Node 2',
          x: 800,
          y: 300
        }, {
          name: 'Node 3',
          x: 550,
          y: 100
        }, {
          name: 'Node 4',
          x: 550,
          y: 500
        }],
        // links: [],
        links: [{
          source: 0,
          target: 1,
          symbolSize: [5, 20],
          label: {
              show: true
          },
          lineStyle: {
              width: 5,
              curveness: 0.2
          }
        }, {
          source: 'Node 2',
          target: 'Node 1',
          label: {
              show: true
          },
          lineStyle: {
            curveness: 0.2
          }
        }, {
          source: 'Node 1',
          target: 'Node 3'
        }, {
          source: 'Node 2',
          target: 'Node 3'
        }, {
          source: 'Node 2',
          target: 'Node 4'
        }, {
          source: 'Node 1',
          target: 'Node 4'
        }],
        lineStyle: {
            opacity: 0.9,
            width: 2,
            curveness: 0
        }
      }
    ]
  };

}
