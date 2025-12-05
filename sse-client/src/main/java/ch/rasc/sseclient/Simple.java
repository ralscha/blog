package ch.rasc.sseclient;

import java.net.URI;
import java.util.concurrent.TimeUnit;

import com.launchdarkly.eventsource.EventSource;
import com.launchdarkly.eventsource.background.BackgroundEventHandler;
import com.launchdarkly.eventsource.background.BackgroundEventSource;

public class Simple {

  public static void main(String[] args) throws InterruptedException {
    BackgroundEventHandler eventHandler = new SimpleEventHandler();
    String url = String.format("http://localhost:8080/memory");
    BackgroundEventSource.Builder builder = new BackgroundEventSource.Builder(eventHandler, 
        new EventSource.Builder(URI.create(url)).retryDelay(3, TimeUnit.SECONDS));

    try (BackgroundEventSource eventSource = builder.build()) {
      eventSource.start();

      TimeUnit.MINUTES.sleep(10);
    }
  }

}
