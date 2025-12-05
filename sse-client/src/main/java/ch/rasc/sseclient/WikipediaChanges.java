package ch.rasc.sseclient;

import java.net.URI;
import java.util.concurrent.TimeUnit;

import com.launchdarkly.eventsource.EventSource;
import com.launchdarkly.eventsource.background.BackgroundEventHandler;
import com.launchdarkly.eventsource.background.BackgroundEventSource;

public class WikipediaChanges {

  public static void main(String[] args) throws InterruptedException {
    BackgroundEventHandler eventHandler = new WikipediaChangeHandler();
    String url = "https://stream.wikimedia.org/v2/stream/recentchange";
    BackgroundEventSource.Builder builder = new BackgroundEventSource.Builder(eventHandler, 
        new EventSource.Builder(URI.create(url)));

    try (BackgroundEventSource eventSource = builder.build()) {
      eventSource.start();

      TimeUnit.MINUTES.sleep(10);
    }
  }

}
