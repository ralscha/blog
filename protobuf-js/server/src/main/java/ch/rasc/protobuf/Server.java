package ch.rasc.protobuf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.protobuf.ProtobufHttpMessageConverter;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Server {

  public static void main(String[] args) {
    SpringApplication.run(Server.class, args);
  }

  @Bean
  public ProtobufHttpMessageConverter protobufHttpMessageConverter() {
    return new ProtobufHttpMessageConverter();
  }
}
