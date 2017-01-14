package ch.rasc.protobuf;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.univocity.parsers.common.record.Record;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;

import ch.rasc.protobuf.EarthquakeOuterClass.Earthquake;
import ch.rasc.protobuf.EarthquakeOuterClass.Earthquake.Builder;

@Service
public class EarthquakeDb {

	private final List<Earthquake> earthquakes = new ArrayList<>();

	EarthquakeDb() {
		readEarthquakeData();
	}

	public List<Earthquake> getEarthquakes() {
		return this.earthquakes;
	}

	@Scheduled(cron = "0 0 * * * ?")
	public void readEarthquakeData() {
		RestTemplate restTemplate = new RestTemplate();
		String result = restTemplate.getForObject(
				"http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv",
				String.class);

		CsvParserSettings settings = new CsvParserSettings();
		settings.setHeaderExtractionEnabled(true);
		settings.setLineSeparatorDetectionEnabled(true);
		CsvParser parser = new CsvParser(settings);
		List<Record> records = parser.parseAllRecords(new StringReader(result));

		this.earthquakes.clear();
		for (Record record : records) {
			Builder builder = Earthquake.newBuilder()
					.setId(record.getString("id"))
					.setTime(record.getString("time"))
					.setLatitude(record.getDouble("latitude"))
					.setLongitude(record.getDouble("longitude"))
					.setDepth(record.getFloat("depth"))
					.setPlace(record.getString("place"));

			Float mag = record.getFloat("mag");
			if (mag != null) {
				builder.setMag(mag);
			}

			String magType = record.getString("magType");
			if (magType != null) {
				builder.setMagType(magType);
			}

			this.earthquakes.add(builder.build());
		}

	}
}
