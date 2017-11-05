package ch.rasc.dynamicpos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration;

import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;

@SpringBootApplication
public class Application extends AbstractReactiveMongoConfiguration {

	@Override
	protected String getDatabaseName() {
		return "earthquakes";
	}

	@Override
	public MongoClient reactiveMongoClient() {
		return MongoClients.create();
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
