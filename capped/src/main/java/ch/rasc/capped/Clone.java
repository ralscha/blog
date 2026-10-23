package ch.rasc.capped;

import java.util.Date;
import java.util.function.Consumer;

import java.util.List;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class Clone {
  public static void main(String[] args) {
    try (MongoClient mongoClient = MongoClients.create()) {
      MongoDatabase db = mongoClient.getDatabase("test");
      db.drop();

      MongoCollection<Document> collection = db.getCollection("log");

      for (int i = 0; i < 1000; i++) {
        Document logMessage = new Document();
        logMessage.append("index", i);
        logMessage.append("message", "User sr");
        logMessage.append("loggedIn", new Date());
        logMessage.append("loggedOut", new Date());
        collection.insertOne(logMessage);
      }

      Document collStats = db.getCollection("log")
          .aggregate(List.of(new Document("$collStats", new Document("storageStats", new Document()))))
          .first().get("storageStats", Document.class);
      System.out.println(collStats.get("capped")); // false

      Document doc = new Document("cloneCollectionAsCapped", "log");
      doc.append("toCollection", "logCapped");
      doc.append("size", 1024);
      Document result = db.runCommand(doc);
      System.out.println(result.toJson());

      collStats = db.getCollection("log")
          .aggregate(List.of(new Document("$collStats", new Document("storageStats", new Document()))))
          .first().get("storageStats", Document.class);
      System.out.println(collStats.get("capped")); // false

      collStats = db.getCollection("logCapped")
          .aggregate(List.of(new Document("$collStats", new Document("storageStats", new Document()))))
          .first().get("storageStats", Document.class);
        System.out.println(collStats.get("capped")); // true

      db.getCollection("logCapped").find().forEach(
          (Consumer<Document>) document -> System.out.println(document.get("index")));
    }
  }
}
