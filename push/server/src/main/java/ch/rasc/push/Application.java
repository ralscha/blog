package ch.rasc.push;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import de.bytefish.fcmjava.client.FcmClient;
import de.bytefish.fcmjava.http.client.IFcmClient;

@SpringBootApplication
@EnableScheduling
public class Application {

	public static final Logger logger = LoggerFactory.getLogger("ch.rasc.push");

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public IFcmClient fcmClient(FcmSettings settings) {
		return new FcmClient(settings);
	}
}
