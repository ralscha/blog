import { EarthquakeService } from './earthquake-service';
import { EarthquakeDetail } from './earthquake-detail';

export async function init() {
    if (process.env.NODE_ENV === 'production') {
        document.getElementById('environment').innerHTML = 'production';
    } else {
        document.getElementById('environment').innerHTML = 'development';
    }

    const dotEnvContent = `APP_NAME = ${process.env.APP_NAME}<br>APP_ENV = ${process.env.APP_ENV}<br>APP_KEY = ${process.env.APP_KEY}`;    
    document.getElementById('dotEnv').innerHTML = dotEnvContent;

    const outputDiv = document.getElementById('output');
    const service = new EarthquakeService();
    const earthquakes = await service.fetch();

    const output = [];
    for (const earthquake of earthquakes) {
        const detail = new EarthquakeDetail(earthquake);
        output.push(detail.render());
    }

    outputDiv.innerHTML = output.join('');

    document.getElementById('aboutButton').addEventListener('click', async () => {
        const module = await import('./about');
        module.showAbout();
    });
}
