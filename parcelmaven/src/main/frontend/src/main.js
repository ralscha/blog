import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/gauge';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { v4 as uuidv4 } from 'uuid';

const EventSource = NativeEventSource || EventSourcePolyfill;

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
            textStyle: {
                color: 'black',
                fontSize: 40
            }
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
                color: 'auto'
            }
        },
        splitLine: {
            length: 15,
            lineStyle: {
                color: 'auto'
            }
        },
        detail: {
            show: true,
            offsetCenter: [ '0%', '-50%' ],
            textStyle: {
                color: 'auto',
                fontSize: 50,
                fontStyle: 'bold'
            }
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
