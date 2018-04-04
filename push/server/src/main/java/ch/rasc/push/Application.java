package ch.rasc.push;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Application {

  public static final Logger logger = LoggerFactory.getLogger("ch.rasc.push");

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

}
