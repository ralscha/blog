package ch.rasc.dynamicpos;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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

    return Flux.fromIterable(viewportPolygons(lng1, lat1, lng2, lat2))
        .flatMap(this.repository::findByLocationWithin).distinct(Earthquake::getId);
  }

  static List<GeoJsonPolygon> viewportPolygons(double west, double south,
      double east, double north) {
    if (!Double.isFinite(west) || !Double.isFinite(east) || !Double.isFinite(south)
        || !Double.isFinite(north) || south < -90 || north > 90 || south >= north) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid viewport bounds");
    }
    double width = east - west;
    if (width < 0) {
      width = (width % 360 + 360) % 360;
    }
    width = Math.min(width, 360);
    double start = ((west + 180) % 360 + 360) % 360 - 180;
    List<GeoJsonPolygon> polygons = new ArrayList<>();
    while (width > 0) {
      double end = Math.min(180, start + Math.min(width, 90));
      List<Point> points = new ArrayList<>();
      points.add(new Point(start, south));
      if (south > -90) {
        points.add(new Point(end, south));
      }
      if (south < 0 && north > 0) {
        points.add(new Point(end, 0));
      }
      points.add(new Point(end, north));
      if (north < 90) {
        points.add(new Point(start, north));
      }
      if (south < 0 && north > 0) {
        points.add(new Point(start, 0));
      }
      points.add(points.getFirst());
      polygons.add(new GeoJsonPolygon(points));
      width -= end - start;
      start = end == 180 ? -180 : end;
    }
    return polygons;
  }
}
