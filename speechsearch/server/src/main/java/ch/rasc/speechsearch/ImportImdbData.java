package ch.rasc.speechsearch;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.GZIPInputStream;

import org.bson.Document;
import org.springframework.util.StringUtils;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.WriteConcern;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Indexes;
import com.mongodb.client.model.InsertOneModel;
import com.mongodb.client.model.UpdateOneModel;
import com.mongodb.client.model.Updates;
import com.univocity.parsers.common.record.Record;
import com.univocity.parsers.tsv.TsvParser;
import com.univocity.parsers.tsv.TsvParserSettings;

public class ImportImdbData {

  public static void main(String[] args)
      throws IOException, InterruptedException, URISyntaxException {

    Path actorsFile = Paths.get("./name.basics.tsv.gz");
    if (!Files.exists(actorsFile)) {
      download("name.basics.tsv.gz", actorsFile);
    }

    Path actorMovieFile = Paths.get("./title.principals.tsv.gz");
    if (!Files.exists(actorMovieFile)) {
      download("title.principals.tsv.gz", actorMovieFile);
    }

    Path moviesFile = Paths.get("./title.basics.tsv.gz");
    if (!Files.exists(moviesFile)) {
      download("title.basics.tsv.gz", moviesFile);
    }

    TsvParserSettings settings = new TsvParserSettings();
    settings.setHeaderExtractionEnabled(true);
    TsvParser parser = new TsvParser(settings);

    ConnectionString connectionString = new ConnectionString("mongodb://localhost:27107");
    MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
        .applyConnectionString(connectionString).writeConcern(WriteConcern.UNACKNOWLEDGED)
        .build();

    try (MongoClient mongoClient = MongoClients.create(mongoClientSettings)) {
      MongoDatabase database = mongoClient.getDatabase("imdb");
      MongoCollection<Document> actorsCollection = database.getCollection("actors");

      List<InsertOneModel<Document>> documents = new ArrayList<>();

      try (InputStream is = Files.newInputStream(actorsFile);
          GZIPInputStream gzIs = new GZIPInputStream(is)) {
        for (Record record : parser.iterateRecords(gzIs)) {
          String actorId = record.getString("nconst");
          String primaryName = record.getString("primaryName");

          Document doc = new Document("_id", actorId).append("name", primaryName);
          documents.add(new InsertOneModel<>(doc));

          if (documents.size() > 5_000) {
            actorsCollection.bulkWrite(documents);
            documents.clear();
          }
        }

        if (!documents.isEmpty()) {
          actorsCollection.bulkWrite(documents);
          documents.clear();
        }
      }

      parser = new TsvParser(settings);
      MongoCollection<Document> moviesCollection = database.getCollection("movies");
      try (InputStream is = Files.newInputStream(moviesFile);
          GZIPInputStream gzIs = new GZIPInputStream(is)) {
        for (Record record : parser.iterateRecords(gzIs)) {

          String titleType = record.getString("titleType");
          if (!"movie".equals(titleType)) {
            continue;
          }

          String movieId = record.getString("tconst");
          String primaryTitle = record.getString("primaryTitle");
          String originalTitle = record.getString("originalTitle");
          Boolean adultMovie = record.getBoolean("isAdult", "1", "0");
          String runtimeMinutesStr = record.getString("runtimeMinutes");
          String genres = record.getString("genres");

          Document doc = new Document("_id", movieId);
          if (isNotNull(primaryTitle)) {
            doc.append("primaryTitle", primaryTitle);
          }
          if (isNotNull(originalTitle)) {
            doc.append("originalTitle", originalTitle);
          }
          if (adultMovie != null) {
            doc.append("adultMovie", adultMovie);
          }
          if (isNotNull(runtimeMinutesStr)) {
            doc.append("runtimeMinutes", Integer.valueOf(runtimeMinutesStr));
          }
          if (isNotNull(genres)) {
            doc.append("genres", genres);
          }

          documents.add(new InsertOneModel<>(doc));

          if (documents.size() > 5_000) {
            moviesCollection.bulkWrite(documents);
            documents.clear();
          }
        }

        if (!documents.isEmpty()) {
          moviesCollection.bulkWrite(documents);
          documents.clear();
        }
      }

      List<UpdateOneModel<Document>> movieUpdates = new ArrayList<>();
      List<UpdateOneModel<Document>> actorUpdates = new ArrayList<>();
      parser = new TsvParser(settings);

      try (InputStream is = Files.newInputStream(actorMovieFile);
          GZIPInputStream gzIs = new GZIPInputStream(is)) {
        for (Record record : parser.iterateRecords(gzIs)) {
          String movieId = record.getString("tconst");
          String principalId = record.getString("nconst");

          movieUpdates.add(new UpdateOneModel<>(Filters.eq("_id", movieId),
              Updates.addToSet("actors", principalId)));

          actorUpdates.add(new UpdateOneModel<>(Filters.eq("_id", principalId),
              Updates.addToSet("movies", movieId)));

          if (movieUpdates.size() > 5_000) {
            moviesCollection.bulkWrite(movieUpdates);
            actorsCollection.bulkWrite(actorUpdates);
            movieUpdates.clear();
            actorUpdates.clear();
          }
        }

        if (!movieUpdates.isEmpty()) {
          moviesCollection.bulkWrite(movieUpdates);
          actorsCollection.bulkWrite(actorUpdates);
          movieUpdates.clear();
          actorUpdates.clear();
        }
      }

      moviesCollection.createIndex(Indexes.ascending("primaryTitle"));
    }
  }

  private static boolean isNotNull(String text) {
    return StringUtils.hasText(text) && !"\\N".equals(text);
  }

  private static void download(String fileName, Path target)
      throws IOException, InterruptedException, URISyntaxException {

    HttpClient client = HttpClient.newHttpClient();

    HttpRequest request = HttpRequest.newBuilder()
        .uri(new URI("https://datasets.imdbws.com/" + fileName)).GET().build();

    client.send(request, HttpResponse.BodyHandlers.ofFile(target));
  }

}