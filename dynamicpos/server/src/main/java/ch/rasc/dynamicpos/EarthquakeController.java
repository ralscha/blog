package ch.rasc.dynamicpos;

import org.springframework.data.geo.Box;
import org.springframework.data.geo.Point;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Flux;

@RestController
@CrossOrigin
public class EarthquakeController {

	private final ReactiveEarthquakeRepository repository;

	public EarthquakeController(ReactiveEarthquakeRepository repository) {
		this.repository = repository;
	}

	@GetMapping("/earthquakes/{lng1}/{lat1}/{lng2}/{lat2}")
	public Flux<Earthquake> findNear(@PathVariable("lng1") double lng1,
			@PathVariable("lat1") double lat1, @PathVariable("lng2") double lng2,
			@PathVariable("lat2") double lat2) {

		Box box = new Box(new Point(lng1, lat1), new Point(lng2, lat2));
		return this.repository.findByLocationWithin(box);

	}
}