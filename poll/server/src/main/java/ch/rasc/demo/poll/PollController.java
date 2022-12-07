package ch.rasc.demo.poll;

import java.util.concurrent.ConcurrentMap;

import org.mapdb.DB;
import org.mapdb.DBMaker;
import org.mapdb.Serializer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import ch.rasc.sse.eventbus.SseEvent;
import ch.rasc.sse.eventbus.SseEventBus;
import jakarta.annotation.PreDestroy;
import jakarta.servlet.http.HttpServletResponse;

@Controller
@CrossOrigin
public class PollController {

  private final SseEventBus eventBus;

  private final DB db;

  private final ConcurrentMap<String, Long> pollMap;

  private final static String[] oss = { "Windows", "macOS", "Linux", "Other" };

  PollController(SseEventBus eventBus) {
    this.eventBus = eventBus;

    this.db = DBMaker.fileDB("./counter.db").transactionEnable().make();
    this.pollMap = this.db.hashMap("polls", Serializer.STRING, Serializer.LONG)
        .createOrOpen();

    for (String os : oss) {
      this.pollMap.putIfAbsent(os, 0L);
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
  public void poll(@RequestBody String os) {
    this.pollMap.merge(os, 1L, (oldValue, one) -> oldValue + one);
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
    StringBuilder sb = new StringBuilder(10);

    for (int i = 0; i < oss.length; i++) {
      sb.append(this.pollMap.get(oss[i]));
      if (i < oss.length - 1) {
        sb.append(',');
      }
    }

    SseEvent.Builder builder = SseEvent.builder().data(sb.toString());
    if (clientId != null) {
      builder.addClientId(clientId);
    }
    this.eventBus.handleEvent(builder.build());
  }

}
