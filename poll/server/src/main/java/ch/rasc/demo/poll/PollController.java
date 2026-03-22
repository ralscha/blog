package ch.rasc.demo.poll;

import java.util.List;
import java.util.concurrent.ConcurrentMap;

import org.mapdb.DB;
import org.mapdb.DBMaker;
import org.mapdb.Serializer;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import ch.rasc.sse.eventbus.SseEvent;
import ch.rasc.sse.eventbus.SseEventBus;
import jakarta.annotation.PreDestroy;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin
public class PollController {

  private static final List<OperatingSystem> OPERATING_SYSTEMS = List.of(
      OperatingSystem.WINDOWS, OperatingSystem.MACOS, OperatingSystem.LINUX,
      OperatingSystem.OTHER);

  private final SseEventBus eventBus;

  private final ObjectMapper objectMapper;

  private final DB db;

  private final ConcurrentMap<String, Long> pollMap;

  PollController(SseEventBus eventBus, ObjectMapper objectMapper) {
    this.eventBus = eventBus;
    this.objectMapper = objectMapper;

    this.db = DBMaker.fileDB("./counter.db").transactionEnable().make();
    this.pollMap = this.db.hashMap("polls", Serializer.STRING, Serializer.LONG)
        .createOrOpen();

    for (OperatingSystem operatingSystem : OPERATING_SYSTEMS) {
      this.pollMap.putIfAbsent(operatingSystem.label(), 0L);
    }
  }

  @PreDestroy
  public void close() {
    if (this.db != null) {
      this.db.close();
    }
  }

  @PostMapping("/poll")
  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  public void poll(@RequestBody VoteRequest voteRequest) {
    String label = voteRequest != null ? voteRequest.operatingSystem() : null;
    OperatingSystem operatingSystem = OperatingSystem.fromLabel(label);
    this.pollMap.merge(operatingSystem.label(), 1L, Long::sum);
    this.db.commit();
    sendPollData(null);
  }

  @GetMapping("/register/{id}")
  public SseEmitter register(@PathVariable("id") String id,
      HttpServletResponse response) {
    response.setHeader("Cache-Control", "no-store");
    SseEmitter sseEmitter = this.eventBus.createSseEmitter(id, SseEvent.DEFAULT_EVENT);

    // send the initial data only to this client
    sendPollData(id);

    return sseEmitter;
  }

  private void sendPollData(String clientId) {
    var builder = SseEvent.builder().data(currentSnapshotJson());
    if (clientId != null) {
      builder.addClientId(clientId);
    }
    this.eventBus.handleEvent(builder.build());
  }

  private String currentSnapshotJson() {
    PollSnapshot snapshot = new PollSnapshot(
        OPERATING_SYSTEMS.stream().map(operatingSystem -> new PollResult(
            operatingSystem.label(),
            this.pollMap.getOrDefault(operatingSystem.label(), 0L))).toList());

    try {
      return this.objectMapper.writeValueAsString(snapshot);
    }
    catch (JacksonException e) {
      throw new IllegalStateException("Unable to serialize poll snapshot", e);
    }
  }

  private enum OperatingSystem {
    WINDOWS("Windows"),
    MACOS("macOS"),
    LINUX("Linux"),
    OTHER("Other");

    private final String label;

    OperatingSystem(String label) {
      this.label = label;
    }

    String label() {
      return this.label;
    }

    static OperatingSystem fromLabel(String label) {
      for (OperatingSystem operatingSystem : values()) {
        if (operatingSystem.label.equals(label)) {
          return operatingSystem;
        }
      }

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Unknown operating system");
    }
  }

  public record VoteRequest(String operatingSystem) {
  }

  private record PollSnapshot(long totalVotes, List<PollResult> results) {
    public PollSnapshot(List<PollResult> results) {
      this(results.stream().mapToLong(PollResult::votes).sum(), results);
    }
  }

  private record PollResult(String label, long votes) {
  }

}
