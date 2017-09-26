package ch.rasc.upload;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

	public static final Logger logger = LoggerFactory.getLogger("ch.rasc.upload");

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
