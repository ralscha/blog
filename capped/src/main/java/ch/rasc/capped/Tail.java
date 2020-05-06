package ch.rasc.capped;

import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.bson.Document;

import com.mongodb.CursorType;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.CreateCollectionOptions;

public class Tail {

  public static void main(String[] args) throws InterruptedException {
    try (MongoClient mongoClient = MongoClients.create()) {
      MongoDatabase db = mongoClient.getDatabase("test");
      db.drop();

      db.createCollection("log",
          new CreateCollectionOptions().capped(true).sizeInBytes(512));

      MongoCollection<Document> collection = db.getCollection("log");

      AtomicInteger index = new AtomicInteger(0);
      Thread insertThread = new Thread(() -> {
        while (true) {
          try {
            TimeUnit.SECONDS.sleep(1);
          }
          catch (InterruptedException e) {
            // ignore this
          }

          Document logMessage = new Document();
          logMessage.append("index", index.incrementAndGet());
          logMessage.append("message", "User sr");
          logMessage.append("loggedIn", new Date());
          logMessage.append("loggedOut", new Date());
          collection.insertOne(logMessage);
        }
      });
      insertThread.start();

      while (true) {
        try (MongoCursor<Document> cursor = collection.find()
            .cursorType(CursorType.TailableAwait).noCursorTimeout(true).iterator()) {
          while (cursor.hasNext()) {
            Document doc = cursor.next();
            System.out.println(doc.get("index"));
          }
        }
        TimeUnit.SECONDS.sleep(2);
      }

    }
  }

}
