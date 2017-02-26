package ch.rasc.push;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import de.bytefish.fcmjava.http.client.IFcmClient;
import de.bytefish.fcmjava.model.options.FcmMessageOptions;
import de.bytefish.fcmjava.requests.data.DataUnicastMessage;
import de.bytefish.fcmjava.requests.notification.NotificationPayload;
import de.bytefish.fcmjava.responses.FcmMessageResponse;
import de.bytefish.fcmjava.responses.FcmMessageResultItem;

@Service
public class PersonalMessageSender {

  private final Set<String> tokenRegistry = new CopyOnWriteArraySet<>();

  private final IFcmClient fcmClient;

  private int id = 0;

  public PersonalMessageSender(IFcmClient fcmClient) {
    this.fcmClient = fcmClient;
  }

  public void addToken(String token) {
    this.tokenRegistry.add(token);
  }

  public void removeToken(String token) {
    this.tokenRegistry.remove(token);
  }

  @Scheduled(fixedDelay = 30_000)
  void sendPushMessages() {
    FcmMessageOptions options = FcmMessageOptions.builder()
        .setTimeToLive(Duration.ofMinutes(2)).build();

    NotificationPayload payload = NotificationPayload.builder()
        .setBody("A Personal Message").setTitle("Personal Message").setTag("personal")
        .build();

    for (String token : this.tokenRegistry) {
      System.out.println("Sending personal message to: " + token);
      Map<String, Object> data = new HashMap<>();
      data.put("id", ++this.id);
      data.put("text", Math.random() * 1000);

      DataUnicastMessage message = new DataUnicastMessage(options, token, data, payload);
      FcmMessageResponse response = this.fcmClient.send(message);
      for (FcmMessageResultItem result : response.getResults()) {
        if (result.getErrorCode() != null) {
          System.out.printf("Sending to %s failed. Error Code %s\n", token,
              result.getErrorCode());
        }
      }
    }
  }

}
