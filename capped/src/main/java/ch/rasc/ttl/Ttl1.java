package ch.rasc.ttl;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;

public class Ttl1 {

  public static void main(String[] args) throws InterruptedException {

    try (MongoClient mongoClient = MongoClients.create()) {
      MongoDatabase db = mongoClient.getDatabase("test");
      db.drop();

      MongoCollection<Document> collection = db.getCollection("log");

      // TTL Index
      collection.createIndex(Indexes.ascending("date"),
          new IndexOptions().expireAfter(1L, TimeUnit.MINUTES));

      for (int j = 0; j < 5; j++) {
        Document logMessage = new Document();
        logMessage.append("date", new Date());
        logMessage.append("severity", "INFO");
        logMessage.append("message", String.valueOf(j));
        collection.insertOne(logMessage);
      }

      System.out.println(collection.countDocuments()); // 5

      TimeUnit.SECONDS.sleep(120);

      System.out.println(collection.countDocuments()); // 0

    }
  }

}
