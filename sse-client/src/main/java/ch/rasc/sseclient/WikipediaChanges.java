package ch.rasc.sseclient;

import java.net.URI;
import java.util.concurrent.TimeUnit;

import com.launchdarkly.eventsource.EventHandler;
import com.launchdarkly.eventsource.EventSource;

public class WikipediaChanges {

  public static void main(String[] args) throws InterruptedException {
    EventHandler eventHandler = new WikipediaChangeHandler();
    String url = "https://stream.wikimedia.org/v2/stream/recentchange";
    EventSource.Builder builder = new EventSource.Builder(eventHandler, URI.create(url));

    try (EventSource eventSource = builder.build()) {
      eventSource.start();
      
      TimeUnit.MINUTES.sleep(10);
    }
  }

}
