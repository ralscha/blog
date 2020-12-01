package ch.rasc.upload;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import io.minio.MinioClient;

@SpringBootApplication
public class Application {

  public final static Logger logger = LoggerFactory.getLogger(Application.class);

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

  @Bean
  public MinioClient minioClient(MinioConfig config) {
    return MinioClient.builder().endpoint(config.getEndpoint())
        .credentials(config.getAccessKey(), config.getSecretKey()).build();
  }
}
