package ch.rasc.capped;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

public class Capped {
  public static void main(String[] args) {

    try (MongoClient mongoClient = MongoClients.create()) {
      MongoDatabase db = mongoClient.getDatabase("test");

      Document collStats = db.runCommand(new Document("collStats", "log"));

      System.out.println("Is capped: " + collStats.get("capped"));
      System.out.println("Max. Documents: " + collStats.get("max"));
      System.out.println("Max. Size in Bytes: " + collStats.get("maxSize"));
    }
  }
}
