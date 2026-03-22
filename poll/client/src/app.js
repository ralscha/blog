import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([PieChart, TooltipComponent, TitleComponent, CanvasRenderer]);
const operatingSystems = ['Windows', 'macOS', 'Linux', 'Other'];

const elements = {
    alreadyVotedMessage: document.getElementById('hasVotedAlreadyErrorMsg'),
    chart: document.getElementById('chart'),
    voteButton: document.getElementById('vote-button'),
    voteForm: document.getElementById('vote-form'),
    votedMessage: document.getElementById('voted')
};


export function init() {
    const chart = echarts.init(elements.chart);
    chart.setOption(getChartOption());

    if (localStorage.getItem('hasVoted') === 'true') {
        showAlreadyVotedState();
    }
    else {
        showVotingState();
    }

    elements.voteButton.addEventListener('click', async () => {
        const selectedOption = document.querySelector('input[name=os]:checked');
        if (!selectedOption) {
            return;
        }

        try {
            await fetch('/poll', {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ operatingSystem: selectedOption.value })
            });

            localStorage.setItem('hasVoted', 'true');
            showVoteSubmittedState();
        }
        catch (error) {
            console.error('Unable to submit vote', error);
        }
    });

    const eventSource = new EventSource(`/register/${crypto.randomUUID()}`);
    eventSource.addEventListener('message', ({ data }) => {
        const snapshot = JSON.parse(data);
        chart.setOption({
            title: {
                text: `Total Votes: ${snapshot.totalVotes}`
            },
            series: [{
                data: snapshot.results.map(({ label, votes }) => ({
                    value: votes,
                    name: label
                }))
            }]
        });
    }, false);

    window.addEventListener('beforeunload', () => {
        eventSource.close();
        chart.dispose();
    }, { once: true });


}

function showVotingState() {
    elements.alreadyVotedMessage.classList.add('hidden');
    elements.voteForm.classList.remove('hidden');
    elements.votedMessage.classList.add('hidden');
}

function showAlreadyVotedState() {
    elements.alreadyVotedMessage.classList.remove('hidden');
    elements.voteForm.classList.add('hidden');
    elements.votedMessage.classList.add('hidden');
}

function showVoteSubmittedState() {
    elements.alreadyVotedMessage.classList.add('hidden');
    elements.voteForm.classList.add('hidden');
    elements.votedMessage.classList.remove('hidden');
}

function getChartOption() {
    return {
        title: {
            text: 'Total Votes: 0',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        series: [
            {
                name: 'Operating System',
                type: 'pie',
                radius: '60%',
                center: ['50%', '45%'],
                data: operatingSystems.map((label) => ({ value: 0, name: label })),
                emphasis: {
                    itemStyle: {
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

