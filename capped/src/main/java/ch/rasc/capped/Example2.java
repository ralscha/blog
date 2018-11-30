package ch.rasc.capped;

import java.util.Date;
import java.util.function.Consumer;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.CreateCollectionOptions;

public class Example2 {
  public static void main(String[] args) {
    try (MongoClient mongoClient = new MongoClient()) {
      MongoDatabase db = mongoClient.getDatabase("test");
      db.drop();

      db.createCollection("log",
          new CreateCollectionOptions().capped(true).maxDocuments(3).sizeInBytes(512));

      MongoCollection<Document> collection = db.getCollection("log");

      for (int j = 0; j < 10; j++) {
        Document logMessage = new Document();
        logMessage.append("index", j);
        logMessage.append("message", "User sr");
        logMessage.append("loggedIn", new Date());
        logMessage.append("loggedOut", new Date());
        collection.insertOne(logMessage);
      }

      collection.find()
          .forEach((Consumer<Document>) block -> System.out.println(block.get("index")));
      // 7
      // 8
      // 9
    }

  }
}
