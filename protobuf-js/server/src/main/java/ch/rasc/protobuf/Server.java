package ch.rasc.protobuf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
@EnableScheduling
public class Server extends WebMvcConfigurerAdapter {

  public static void main(String[] args) {
    SpringApplication.run(Server.class, args);
  }

  @Override
  public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
    configurer.mediaType("protobuf", MediaType.valueOf("application/x-protobuf"));
  }

  @Bean
  Protobuf3HttpMessageConverter protobufHttpMessageConverter() {
    return new Protobuf3HttpMessageConverter();
  }
}
