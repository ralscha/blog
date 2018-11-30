package ch.rasc.capped;

import java.util.Date;
import java.util.function.Consumer;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class Convert {

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

      Document doc = new Document("convertToCapped", "log");
      doc.append("size", 1024);
      Document result = db.runCommand(doc);
      System.out.println(result.toJson());

      collStats = db.runCommand(new Document("collStats", "log"));
      System.out.println(collStats.get("capped")); // true

      collection.find().forEach(
          (Consumer<Document>) document -> System.out.println(document.get("index")));
      // 989
      // 990
      // 991
      // 992
      // 993
      // 994
      // 995
      // 996
      // 997
      // 998
      // 999
    }
  }

}
