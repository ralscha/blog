import Papa from 'papaparse';

export class EarthquakeService {

    async fetch() {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.csv');
        const csvdata = await response.text();
        const earthquakes = Papa.parse(csvdata, { header: true }).data;
        return earthquakes.filter(e => e.time !== '');
    }

}