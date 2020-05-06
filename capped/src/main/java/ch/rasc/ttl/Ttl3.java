package ch.rasc.ttl;

import java.time.LocalDateTime;
import java.time.ZoneId;
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
      logMessage.append("date", new Date());
      logMessage.append("expireAt", toDate(LocalDateTime.now().plusSeconds(10)));
      logMessage.append("severity", "INFO");
      logMessage.append("message", "a debug message");
      collection.insertOne(logMessage);

      logMessage = new Document();
      logMessage.append("date", new Date());
      logMessage.append("expireAt", toDate(LocalDateTime.now().plusMinutes(2)));
      logMessage.append("severity", "WARN");
      logMessage.append("message", "an info message");
      collection.insertOne(logMessage);

      logMessage = new Document();
      logMessage.append("date", new Date());
      logMessage.append("expireAt", toDate(LocalDateTime.now().plusMinutes(5)));
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

  private static Date toDate(LocalDateTime ldt) {
    return Date.from(ldt.atZone(ZoneId.systemDefault()).toInstant());
  }

}
