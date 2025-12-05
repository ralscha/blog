package ch.rasc.sseclient;

import java.net.URI;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.launchdarkly.eventsource.EventSource;
import com.launchdarkly.eventsource.background.BackgroundEventSource;

public class EmojiTracker {

  public static void main(String[] args) throws InterruptedException {
    final Pattern dataRegex = Pattern.compile("\"([A-F0-9]+)\":(\\d+)");

    String url = "http://emojitrack-gostreamer.herokuapp.com/subscribe/eps";
    BackgroundEventSource.Builder builder = new BackgroundEventSource.Builder(
        (DefaultEventHandler) (event, messageEvent) -> {
          Matcher matcher = dataRegex.matcher(messageEvent.getData());
          while (matcher.find()) {
            int characterCode = Integer.parseInt(matcher.group(1), 16);
            System.out.print(Character.getName(characterCode));
            System.out.print(" (");
            System.out.print(matcher.group(2));
            System.out.println(")");
          }

        }, new EventSource.Builder(URI.create(url)));

    try (BackgroundEventSource eventSource = builder.build()) {
      eventSource.start();

      TimeUnit.MINUTES.sleep(10);
    }
  }

}
