package ch.rasc.sseclient;

import java.net.URI;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.launchdarkly.eventsource.EventSource;

public class EmojiTracker {

  public static void main(String[] args) throws InterruptedException {
    final Pattern dataRegex = Pattern.compile("\"([A-F0-9]+)\":(\\d+)");

    String url = "http://emojitrack-gostreamer.herokuapp.com/subscribe/eps";
    EventSource.Builder builder = new EventSource.Builder(
        (DefaultEventHandler) (event, messageEvent) -> {
          Matcher matcher = dataRegex.matcher(messageEvent.getData());
          while (matcher.find()) {
            int characterCode = Integer.parseInt(matcher.group(1), 16);
            System.out.print(Character.getName(characterCode));
            System.out.print(" (");
            System.out.print(matcher.group(2));
            System.out.println(")");
          }

        }, URI.create(url));

    try (EventSource eventSource = builder.build()) {
      eventSource.start();

      TimeUnit.MINUTES.sleep(10);
    }
  }

}
