package ch.rasc.dynamicpos;

import java.io.IOException;
import java.io.StringReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.univocity.parsers.common.record.Record;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;

import jakarta.annotation.PostConstruct;

@Service
public class EarthquakeImporter {

  private final ReactiveEarthquakeRepository repository;

  private final CsvParser parser;

  EarthquakeImporter(ReactiveEarthquakeRepository repository) {
    this.repository = repository;

    CsvParserSettings settings = new CsvParserSettings();
    settings.setHeaderExtractionEnabled(true);
    settings.setLineSeparatorDetectionEnabled(true);
    this.parser = new CsvParser(settings);
  }

  @PostConstruct
  public void read() throws IOException, InterruptedException {
    try (HttpClient httpClient = HttpClient.newHttpClient()) {

      HttpRequest request = HttpRequest.newBuilder().GET()
          .uri(URI.create(
              "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.csv"))
          .build();
  
      HttpResponse<String> response = httpClient.send(request,
          HttpResponse.BodyHandlers.ofString());
  
      List<Record> records = this.parser.parseAllRecords(new StringReader(response.body()));
      List<Earthquake> earthquakes = records.stream().map(Earthquake::new)
          .collect(Collectors.toList());
      insertData(earthquakes);
    }
  }

  private void insertData(List<Earthquake> earthquakes) {
    this.repository.deleteAll().then(this.repository.saveAll(earthquakes).then())
        .subscribe();
  }

}
