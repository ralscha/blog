package ch.rasc.capped;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Consumer;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.CreateCollectionOptions;
import com.mongodb.client.model.Sorts;

public class Example1 {

  public static void main(String[] args) {

    try (MongoClient mongoClient = MongoClients.create()) {
      MongoDatabase db = mongoClient.getDatabase("test");

      Set<String> collectionNames = new HashSet<>();
      db.listCollectionNames().into(collectionNames);

      if (!collectionNames.contains("log")) {
        db.createCollection("log", new CreateCollectionOptions().capped(true)
            // .autoIndex(false)
            .sizeInBytes(256));
      }

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
      // 8
      // 9

      Document last = collection.find().sort(Sorts.descending("$natural")).first();
      System.out.println(last.get("index")); // 9

      //
      // UpdateResult ur = collection.updateOne(
      // Filters.eq("_id", new ObjectId("5a7364a426ae0a26a81bd4e3")),
      // Updates.set("message", "User sra"));
      // System.out.println(ur);
      // // com.mongodb.MongoWriteException: Cannot change the size of a document in
      // a
      // capped
      // // collection: 91 != 90
    }
  }

}
