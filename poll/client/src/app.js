import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import { v4 as uuidv4 } from 'uuid';

echarts.use([PieChart, TooltipComponent, TitleComponent, CanvasRenderer]);
const oss = ["Windows", "macOS", "Linux", "Other"];


export function init() {

    const alreadyVoted = localStorage.getItem('hasVoted');
    document.getElementById('hasVotedAlreadyErrorMsg').classList.toggle('hidden', !alreadyVoted);
    document.getElementById('vote-form').classList.toggle('hidden', alreadyVoted);

    const voteButton = document.getElementById('vote-button');

    voteButton.addEventListener('click', e => {
        localStorage.setItem('hasVoted', true)
        const choice = document.querySelector('input[name=os]:checked').value;

        fetch('poll', {
            method: 'POST',
            body: choice
        }).then(() => {
            document.getElementById('voted').classList.remove('hidden');
            document.getElementById('hasVotedAlreadyErrorMsg').classList.add('hidden');
            document.getElementById('vote-form').classList.add('hidden');
        }).catch((e) => console.log(e));
    });

    const chart = echarts.init(document.getElementById('chart'));
    chart.setOption(getChartOption());

    const eventSource = new EventSource(`register/${uuidv4()}`);
    eventSource.addEventListener('message', response => {
        const pollData = response.data.split(',').map(Number);
        const total = pollData.reduce((accumulator, currentValue) => accumulator + currentValue);

        chart.setOption({
            title: {
                text: `Total Votes: ${total}`
            },
            series: {
                data: [
                    { value: pollData[0], name: oss[0] },
                    { value: pollData[1], name: oss[1] },
                    { value: pollData[2], name: oss[2] },
                    { value: pollData[3], name: oss[3] }
                ],
            }
        });

    }, false);


}

function getChartOption() {
    return {
        title: {
            text: 'Votes',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        series: [
            {
                name: 'Operating System',
                type: 'pie',
                radius: '60%',
                center: ['50%', '45%'],
                data: [
                    { value: 0, name: oss[0] },
                    { value: 0, name: oss[1] },
                    { value: 0, name: oss[2] },
                    { value: 0, name: oss[3] }
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
}

init();

