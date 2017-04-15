package ch.rasc.protobuf;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.rasc.protobuf.EarthquakeOuterClass.Earthquake;
import ch.rasc.protobuf.EarthquakeOuterClass.Earthquakes;

@RestController
public class EarthquakeController {
	private final EarthquakeDb earthquakeDb;

	public EarthquakeController(EarthquakeDb earthquakeDb) {
		this.earthquakeDb = earthquakeDb;
	}

	@CrossOrigin
	@GetMapping(value = "/earthquakes", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<EarthquakeDto> getEarthquakesJson() {
		return this.earthquakeDb.getEarthquakes().stream().map(this::toDto)
				.collect(Collectors.toList());
	}

	private EarthquakeDto toDto(Earthquake earthquake) {
		EarthquakeDto dto = new EarthquakeDto();
		dto.setId(earthquake.getId());
		dto.setTime(earthquake.getTime());
		dto.setLatitude(earthquake.getLatitude());
		dto.setLongitude(earthquake.getLongitude());
		dto.setDepth(earthquake.getDepth());
		dto.setMag(earthquake.getMag());
		dto.setPlace(earthquake.getPlace());
		dto.setMagType(earthquake.getMagType());
		return dto;
	}

	@CrossOrigin
	@GetMapping(value = "/earthquakes", produces = "application/x-protobuf")
	public Earthquakes getEarthquakesProtobuf() {
		return Earthquakes.newBuilder().addAllEarthquakes(this.earthquakeDb.getEarthquakes())
				.build();
	}

	@CrossOrigin
	@GetMapping(value = "/refresh")
	public void refresh() throws IOException {
		this.earthquakeDb.readEarthquakeData();
	}

}
