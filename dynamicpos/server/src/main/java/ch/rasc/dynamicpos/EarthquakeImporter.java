package ch.rasc.dynamicpos;

import java.io.StringReader;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.univocity.parsers.common.record.Record;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;

@Service
public class EarthquakeImporter {

	private final ReactiveEarthquakeRepository repository;

	private final WebClient client;

	private final CsvParser parser;

	EarthquakeImporter(ReactiveEarthquakeRepository repository) {
		this.repository = repository;

		this.client = WebClient.create("https://earthquake.usgs.gov");

		CsvParserSettings settings = new CsvParserSettings();
		settings.setHeaderExtractionEnabled(true);
		settings.setLineSeparatorDetectionEnabled(true);
		this.parser = new CsvParser(settings);
	}

	@PostConstruct
	public void read() {
		String importedData = this.client.get()
				.uri("/earthquakes/feed/v1.0/summary/2.5_month.csv")
				.accept(MediaType.TEXT_PLAIN).retrieve().bodyToMono(String.class).block();

		List<Record> records = this.parser
				.parseAllRecords(new StringReader(importedData));
		List<Earthquake> earthquakes = records.stream().map(Earthquake::new)
				.collect(Collectors.toList());
		insertData(earthquakes);
	}

	private void insertData(List<Earthquake> earthquakes) {
		this.repository.deleteAll().then(this.repository.saveAll(earthquakes).then())
				.subscribe();
	}

}
