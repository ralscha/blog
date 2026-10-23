package ch.rasc.dynamicpos;

import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;

import reactor.core.publisher.Flux;

public interface ReactiveEarthquakeRepository
    extends ReactiveCrudRepository<Earthquake, String>,
    ReactiveSortingRepository<Earthquake, String> {

  Flux<Earthquake> findByLocationWithin(GeoJsonPolygon polygon);

}
