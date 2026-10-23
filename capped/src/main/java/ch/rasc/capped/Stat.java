package ch.rasc.capped;

import java.util.List;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

public class Stat {
  public static void main(String[] args) {

    try (MongoClient mongoClient = MongoClients.create()) {
      MongoDatabase db = mongoClient.getDatabase("test");

      Document collStats = db.getCollection("log")
          .aggregate(List.of(new Document("$collStats", new Document("storageStats", new Document()))))
          .first().get("storageStats", Document.class);
      System.out.println(collStats.toJson());
      System.out.println("Number of Documents: " + collStats.get("count"));
      System.out.println("Size in Bytes: " + collStats.get("size"));
      System.out.println("Average Object size in Bytes : " + collStats.get("avgObjSize"));
    }
  }
}
