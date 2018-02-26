package ch.rasc.sseclient;

import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Flux;

public class Spring5WebClient {

  public static void main(String[] args) throws InterruptedException {
    Logger logger = LoggerFactory.getLogger("main");
    ParameterizedTypeReference<ServerSentEvent<String>> typeRef = new ParameterizedTypeReference<>() {
      /* nothing_here */};

    while (true) {
      try {
        final Flux<ServerSentEvent<String>> stream = WebClient.create("http://localhost:8080")
            .get().uri("/memory").accept(MediaType.TEXT_EVENT_STREAM).retrieve()
            .bodyToFlux(typeRef);
        stream.subscribe(sse -> logger.info("Received: {}", sse));
        TimeUnit.MINUTES.sleep(10);
      }
      catch (Exception e) {
        e.printStackTrace();
      }
      TimeUnit.SECONDS.sleep(2);
    }
  }

}
