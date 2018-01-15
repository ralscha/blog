import 'regenerator-runtime/runtime';

(async () => {
	const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
	const geojson = await response.json();
			
	const output = [];		
	for (const feature of geojson.features) {
		output.push(feature.properties.mag);
	}
	document.getElementById('output').innerHTML = output.join(', ');
})();