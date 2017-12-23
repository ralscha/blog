package ch.rasc.protobuf;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.util.JsonFormat;

import ch.rasc.protobuf.EarthquakeOuterClass.Earthquakes;

@RestController
@CrossOrigin
public class EarthquakeController {
  private final EarthquakeDb earthquakeDb;

  public EarthquakeController(EarthquakeDb earthquakeDb) {
    this.earthquakeDb = earthquakeDb;
  }

  @GetMapping("/earthquakes")
  public String getEarthquakesJson() throws InvalidProtocolBufferException {
    return JsonFormat.printer().print(this.earthquakeDb.getEarthquakes());
  }

  @GetMapping(path = "/earthquakes", produces = "application/x-protobuf")
  public Earthquakes getEarthquakesProtobuf() {
    return this.earthquakeDb.getEarthquakes();
  }

  @GetMapping(path = "/refresh")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void refresh() throws IOException {
    this.earthquakeDb.readEarthquakeData();
  }

}
