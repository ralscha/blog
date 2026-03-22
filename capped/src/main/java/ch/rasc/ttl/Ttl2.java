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

public class Ttl2 {
  public static void main(String[] args) throws InterruptedException {
    try (MongoClient mongoClient = MongoClients.create()) {
      MongoDatabase db = mongoClient.getDatabase("test");
      db.drop();

      MongoCollection<Document> collection = db.getCollection("log");

      // TTL Index
      collection.createIndex(Indexes.ascending("date"),
          new IndexOptions().expireAfter(1L, TimeUnit.MINUTES));

      Document logMessage = new Document();
      logMessage.append("date", Date.from(Instant.now().minus(5, ChronoUnit.MINUTES)));
      logMessage.append("severity", "INFO");
      logMessage.append("message", "in the past");
      collection.insertOne(logMessage);

      System.out.println(collection.countDocuments()); // 1

      TimeUnit.MINUTES.sleep(1);

      System.out.println(collection.countDocuments()); // 0

    }
  }
}
