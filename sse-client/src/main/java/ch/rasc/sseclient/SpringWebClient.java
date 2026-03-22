package ch.rasc.sseclient;

import java.time.Duration;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.reactive.function.client.WebClient;

public class SpringWebClient {

  private static final Logger logger = LoggerFactory
      .getLogger(SpringWebClient.class);

  public static void main(String[] args) {
    ParameterizedTypeReference<ServerSentEvent<String>> typeRef = new ParameterizedTypeReference<>() {
      /* nothing here */};

    WebClient client = WebClient.builder().baseUrl("http://localhost:8080").build();

    client.get().uri("/memory").accept(MediaType.TEXT_EVENT_STREAM).retrieve()
        .bodyToFlux(typeRef).map(ServerSentEvent::data).filter(Objects::nonNull)
        .doOnNext(data -> logger.info("Received: {}", data))
        .blockLast(Duration.ofMinutes(10));
  }

}