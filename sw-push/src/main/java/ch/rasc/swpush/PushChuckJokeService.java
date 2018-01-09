package ch.rasc.swpush;

import java.util.HashMap;
import java.util.Map;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import ch.rasc.swpush.fcm.FcmClient;
import ch.rasc.swpush.fcm.Notification;
import ch.rasc.swpush.fcm.SendMessage;

@Service
public class PushChuckJokeService {

  private final FcmClient fcmClient;

  private final WebClient webClient;

  private int seq = 0;

  public PushChuckJokeService(FcmClient fcmClient, WebClient webClient) {
    this.fcmClient = fcmClient;
    this.webClient = webClient;
  }

  @Scheduled(fixedDelay = 30_000)
  public void sendChuckQuotes() {
    IcndbJoke joke = this.webClient.get().uri("http://api.icndb.com/jokes/random")
        .retrieve().bodyToMono(IcndbJoke.class).block();
    sendPushMessage(joke);
  }

  void sendPushMessage(IcndbJoke joke) {
    Map<String, Object> data = new HashMap<>();
    data.put("id", joke.getValue().getId());
    data.put("joke", joke.getValue().getJoke());
    data.put("seq", this.seq++);
    data.put("ts", System.currentTimeMillis());

    // Send a message
    System.out.println("Sending chuck joke...");

    Notification notification = new Notification();
    notification.setBody("Background Body (server)");
    notification.setTitle("Background Title (server)");
    notification.setIcon("mail2.png");

    SendMessage sendMessage = new SendMessage();
    sendMessage.setNotification(notification);
    sendMessage.setData(data);
    sendMessage.setTo("/topics/chuck");
    sendMessage.setTimeToLive(2);

    this.fcmClient.send(sendMessage);
  }

}
