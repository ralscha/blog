package ch.rasc.ttl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;

public class Ttl3 {

  public static void main(String[] args) throws InterruptedException {

    try (MongoClient mongoClient = MongoClients.create()) {
      MongoDatabase db = mongoClient.getDatabase("test");
      db.drop();

      MongoCollection<Document> collection = db.getCollection("log");
      collection.createIndex(Indexes.ascending("expireAt"),
          new IndexOptions().expireAfter(0L, TimeUnit.SECONDS));

      Document logMessage = new Document();
      logMessage.append("date", Date.from(Instant.now()));
      logMessage.append("expireAt", Date.from(Instant.now().plus(10, ChronoUnit.SECONDS)));
      logMessage.append("severity", "INFO");
      logMessage.append("message", "an info message");
      collection.insertOne(logMessage);

      logMessage = new Document();
      logMessage.append("date", Date.from(Instant.now()));
      logMessage.append("expireAt", Date.from(Instant.now().plus(2, ChronoUnit.MINUTES)));
      logMessage.append("severity", "WARN");
      logMessage.append("message", "a warning message");
      collection.insertOne(logMessage);

      logMessage = new Document();
      logMessage.append("date", Date.from(Instant.now()));
      logMessage.append("expireAt", Date.from(Instant.now().plus(5, ChronoUnit.MINUTES)));
      logMessage.append("severity", "ERROR");
      logMessage.append("message", "an error message");
      collection.insertOne(logMessage);

      System.out.println(collection.countDocuments()); // 3
      TimeUnit.SECONDS.sleep(60);
      System.out.println(collection.countDocuments()); // 2
      TimeUnit.SECONDS.sleep(120);
      System.out.println(collection.countDocuments()); // 1
      TimeUnit.SECONDS.sleep(180);
      System.out.println(collection.countDocuments()); // 0

    }
  }

}
