package ch.rasc.geotracker;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import ch.rasc.sse.eventbus.SseEvent;
import ch.rasc.sse.eventbus.SseEventBus;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin
public class GeoController {

  private final ApplicationEventPublisher publisher;

  private final List<Position> positions;

  private final ObjectMapper objectMapper;

  private final SseEventBus eventBus;

  public GeoController(ApplicationEventPublisher publisher, ObjectMapper objectMapper,
      SseEventBus eventBus) {
    this.publisher = publisher;
    this.positions = new ArrayList<>();
    this.objectMapper = objectMapper;
    this.eventBus = eventBus;
  }

  @GetMapping("/positions")
  public List<Position> fetchPositions() {
    return this.positions;
  }

  @GetMapping("/register/{id}")
  public SseEmitter eventbus(@PathVariable("id") String id,
      HttpServletResponse response) {
    response.setHeader("Cache-Control", "no-store");
    return this.eventBus.createSseEmitter(id, "pos", "clear");
  }

  @DeleteMapping(path = "/clear")
  @ResponseStatus(value = HttpStatus.NO_CONTENT)
  public void clear() {
    this.positions.clear();
    this.publisher.publishEvent(SseEvent.ofEvent("clear"));
  }

  @PostMapping(path = "/pos")
  @ResponseStatus(value = HttpStatus.NO_CONTENT)
  public void handleLocation(@RequestBody Position position)
      throws JsonProcessingException {
    SseEvent event = SseEvent.of("pos",
        this.objectMapper.writeValueAsString(Collections.singleton(position)));
    this.publisher.publishEvent(event);

    this.positions.add(position);
    if (this.positions.size() > 100) {
      this.positions.remove(0);
    }
  }

  @PostMapping(path = "/clienterror")
  @ResponseStatus(value = HttpStatus.NO_CONTENT)
  public void handleError(@RequestBody String errorMessage) {
    Application.logger.error(errorMessage);
  }

}
