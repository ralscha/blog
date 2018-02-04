package ch.rasc.capped;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;

public class Stat {
  public static void main(String[] args) {

    try (MongoClient mongoClient = new MongoClient()) {
      MongoDatabase db = mongoClient.getDatabase("test");

      Document collStats = db.runCommand(new Document("collStats", "log"));
      System.out.println(collStats.toJson());
      System.out.println("Number of Documents: " + collStats.get("count"));
      System.out.println("Size in Bytes: " + collStats.get("size"));
      System.out.println("Average Object size in Bytes : " + collStats.get("avgObjSize"));
    }
  }
}
