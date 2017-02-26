package ch.rasc.push;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.unbescape.html.HtmlEscape;

import de.bytefish.fcmjava.http.client.IFcmClient;
import de.bytefish.fcmjava.model.enums.ErrorCodeEnum;
import de.bytefish.fcmjava.model.options.FcmMessageOptions;
import de.bytefish.fcmjava.model.topics.Topic;
import de.bytefish.fcmjava.requests.notification.NotificationPayload;
import de.bytefish.fcmjava.requests.topic.TopicUnicastMessage;
import de.bytefish.fcmjava.responses.TopicMessageResponse;

@Service
public class PushChuckJokeService {

  private final RestTemplate restTemplate;

  private final IFcmClient fcmClient;

  private int id = 0;

  public PushChuckJokeService(IFcmClient fcmClient) {
    this.restTemplate = new RestTemplate();
    this.fcmClient = fcmClient;
  }

  @Scheduled(fixedDelay = 30_000)
  public void sendChuckQuotes() {
    IcndbJoke joke = this.restTemplate.getForObject("http://api.icndb.com/jokes/random",
        IcndbJoke.class);
    sendPushMessage(HtmlEscape.unescapeHtml(joke.getValue().getJoke()));
  }

  void sendPushMessage(String joke) {
    FcmMessageOptions options = FcmMessageOptions.builder()
        .setTimeToLive(Duration.ofMinutes(2)).build();

    NotificationPayload payload = NotificationPayload.builder()
        .setBody("A new Chuck Norris joke has arrived").setTitle("Chuck Norris Joke")
        .setTag("chuck").build();

    Map<String, Object> data = new HashMap<>();
    data.put("id", ++this.id);
    data.put("text", joke);

    // Send a message
    System.out.println("Sending chuck joke...");

    Topic topic = new Topic("chuck");
    TopicUnicastMessage message = new TopicUnicastMessage(options, topic, data, payload);

    TopicMessageResponse response = this.fcmClient.send(message);
    ErrorCodeEnum errorCode = response.getErrorCode();
    if (errorCode != null) {
      System.out.println("Topic message sending failed: " + errorCode);
    }
  }

}
