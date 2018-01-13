package ch.rasc.demo.demo;

import java.util.Random;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import ch.rasc.sse.eventbus.SseEvent;

@Service
public class DataEmitterService {

  private final ApplicationEventPublisher eventPublisher;

  private final static Random random = new Random();

  public DataEmitterService(ApplicationEventPublisher eventPublisher) {
    this.eventPublisher = eventPublisher;
  }

  @Scheduled(initialDelay = 2_000, fixedRate = 5_000)
  public void sendData() {
    SseEvent sseEvent = SseEvent.ofData(random.nextInt(31));
    this.eventPublisher.publishEvent(sseEvent);
  }

}
