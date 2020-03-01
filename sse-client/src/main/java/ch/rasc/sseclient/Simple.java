package ch.rasc.sseclient;

import java.net.URI;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

import com.launchdarkly.eventsource.EventHandler;
import com.launchdarkly.eventsource.EventSource;

public class Simple {

  public static void main(String[] args) throws InterruptedException {
    EventHandler eventHandler = new SimpleEventHandler();
    String url = String.format("http://localhost:8080/memory");
    EventSource.Builder builder = new EventSource.Builder(eventHandler, URI.create(url))
        .reconnectTime(Duration.ofMillis(3000));

    try (EventSource eventSource = builder.build()) {
      eventSource.start();

      TimeUnit.MINUTES.sleep(10);
    }
  }

}
