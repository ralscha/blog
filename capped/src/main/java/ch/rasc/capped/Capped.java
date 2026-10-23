package ch.rasc.capped;

import java.util.List;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

public class Capped {
  public static void main(String[] args) {

    try (MongoClient mongoClient = MongoClients.create()) {
      MongoDatabase db = mongoClient.getDatabase("test");

      Document collStats = db.getCollection("log")
          .aggregate(List.of(new Document("$collStats", new Document("storageStats", new Document()))))
          .first().get("storageStats", Document.class);

      System.out.println("Is capped: " + collStats.get("capped"));
      System.out.println("Max. Documents: " + collStats.get("max"));
      System.out.println("Max. Size in Bytes: " + collStats.get("maxSize"));
    }
  }
}
