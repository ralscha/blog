package ch.rasc.swpush;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import ch.rasc.swpush.fcm.FcmClient;

@Service
public class PushChuckJokeService {

  private static final Logger logger = LoggerFactory
      .getLogger(PushChuckJokeService.class);

  private static final String JOKE_API_URL = "https://api.chucknorris.io/jokes/random";

  private final FcmClient fcmClient;

  private final WebClient webClient;

  private int seq = 0;

  public PushChuckJokeService(FcmClient fcmClient, WebClient webClient) {
    this.fcmClient = fcmClient;
    this.webClient = webClient;
  }

  @Scheduled(fixedDelay = 30_000)
  public void sendChuckQuotes() {
    ChuckNorrisJoke joke = this.webClient.get().uri(JOKE_API_URL).retrieve()
        .bodyToMono(ChuckNorrisJoke.class).block();

    if (joke == null || joke.id() == null || joke.value() == null) {
      logger.warn("No joke payload received from {}", JOKE_API_URL);
      return;
    }

    sendPushMessage(joke);
  }

  void sendPushMessage(ChuckNorrisJoke joke) {
    Map<String, String> data = new HashMap<>();
    data.put("id", joke.id());
    data.put("joke", joke.value());
    data.put("seq", String.valueOf(this.seq++));
    data.put("ts", String.valueOf(System.currentTimeMillis()));

    this.fcmClient.send(data);
    logger.info("Sent Chuck Norris joke {}", joke.id());
  }

}
