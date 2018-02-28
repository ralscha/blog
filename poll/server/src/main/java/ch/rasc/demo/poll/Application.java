package ch.rasc.demo.poll;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import ch.rasc.sse.eventbus.config.EnableSseEventBus;

@SpringBootApplication
@EnableSseEventBus
public class Application {

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
