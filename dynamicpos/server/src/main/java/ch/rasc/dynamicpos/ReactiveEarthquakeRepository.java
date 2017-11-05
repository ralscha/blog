package ch.rasc.dynamicpos;

import org.springframework.data.geo.Box;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;

import reactor.core.publisher.Flux;

public interface ReactiveEarthquakeRepository
		extends ReactiveSortingRepository<Earthquake, String> {

	Flux<Earthquake> findByLocationWithin(Box box);

}