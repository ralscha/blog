package ch.rasc.upload;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import io.minio.MinioClient;
import io.minio.errors.InvalidEndpointException;
import io.minio.errors.InvalidPortException;

@SpringBootApplication
public class Application {

	public final static Logger logger = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public MinioClient minioClient(MinioConfig config)
			throws InvalidEndpointException, InvalidPortException {
		return new MinioClient(config.getEndpoint(), config.getAccessKey(),
				config.getSecretKey());
	}
}
