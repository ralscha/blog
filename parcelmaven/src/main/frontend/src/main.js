import * as echarts from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import { v4 as uuidv4 } from 'uuid';


echarts.use([GaugeChart, CanvasRenderer]);

const gauge = echarts.init(document.getElementById('chart'));
gauge.setOption({
    series: [ {
        startAngle: 180,
        endAngle: 0,
        center: [ '50%', '90%' ],
        radius: 300,
        min: 0,
        max: 30,
        name: 'Serie',
        type: 'gauge',
        splitNumber: 6,
        data: [ {
            value: 16,
            name: 'Sensor'
        } ],
        title: {
            show: true,
            offsetCenter: [ '0%', '-70%' ],
            color: 'black',
            fontSize: 40
        },
        axisLine: {
            lineStyle: {
                color: [ [ 0.25, '#ff4500' ], [ 0.75, '#DFEC68' ], [ 1, 'lightgreen' ] ],
                width: 10
            }
        },
        axisTick: {
            length: 13,
            lineStyle: {
                color: 'inherit'
            }
        },
        splitLine: {
            length: 15,
            lineStyle: {
                color: 'inherit'
            }
        },
        detail: {
            show: true,
            offsetCenter: [ '0%', '-50%' ],
            color: 'inherit',
            fontSize: 50,
            fontStyle: 'bold'
        }

    } ]

});

const eventSource = new EventSource(`register/${uuidv4()}`);
eventSource.addEventListener('message', response => {
    const value = parseInt(response.data);
    gauge.setOption({
        series: {
            data: [{
                name: 'Sensor',
                value
            }]
        }
    });
}, false);
