package ch.rasc.capped;

import java.util.Date;

import org.bson.Document;

import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class Clone {
  public static void main(String[] args) {
    try (MongoClient mongoClient = new MongoClient()) {
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

      Document collStats = db.runCommand(new Document("collStats", "log"));
      System.out.println(collStats.get("capped")); // false

      Document doc = new Document("cloneCollectionAsCapped", "log");
      doc.append("toCollection", "logCapped");
      doc.append("size", 1024);
      Document result = db.runCommand(doc);
      System.out.println(result.toJson());

      collStats = db.runCommand(new Document("collStats", "log"));
      System.out.println(collStats.get("capped")); // false

      collStats = db.runCommand(new Document("collStats", "logCapped"));
      System.out.println(collStats.get("capped")); // false

      db.getCollection("logCapped").find().forEach(
          (Block<Document>) document -> System.out.println(document.get("index")));
    }
  }
}
