package ch.rasc.swpush.fcm;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;

import ch.rasc.swpush.FcmSettings;

@Service
public class FcmClient {

  private final WebClient webClient;

  private final FcmSettings settings;

  public FcmClient(WebClient webClient, FcmSettings settings) {
    this.webClient = webClient;
    this.settings = settings;
  }

  public void send(SendMessage sendMessage) {
    ClientResponse response = this.webClient.post()
        .uri("https://fcm.googleapis.com/fcm/send")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .header(HttpHeaders.AUTHORIZATION, "key=" + this.settings.getApiKey())
        .syncBody(sendMessage).exchange().block();

    System.out.println("send: " + response.statusCode());
  }

  public void subscribe(String topic, String clientToken) {
    ClientResponse response = this.webClient.post()
        .uri("https://iid.googleapis.com/iid/v1/{clientToken}/rel/topics/{topic}",
            clientToken, topic)
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .header(HttpHeaders.AUTHORIZATION, "key=" + this.settings.getApiKey()).exchange()
        .block();

    System.out.println("subscribe: " + response.statusCode());
  }
}
