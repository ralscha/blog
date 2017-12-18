package ch.rasc.speechsearch;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.zip.GZIPInputStream;

import org.bson.Document;
import org.springframework.util.StringUtils;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.WriteConcern;
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

	public static void main(String[] args) throws IOException {

		AWSCredentials credentials = new BasicAWSCredentials(args[0], args[1]);
		AmazonS3 s3Client = AmazonS3ClientBuilder.standard().withRegion(Regions.US_EAST_1)
				.withCredentials(new AWSStaticCredentialsProvider(credentials)).build();

		Path actorsFile = Paths.get("./name.basics.tsv.gz");
		if (!Files.exists(actorsFile)) {
			download(s3Client, "name.basics.tsv.gz", actorsFile);
		}

		Path actorMovieFile = Paths.get("./title.principals.tsv.gz");
		if (!Files.exists(actorMovieFile)) {
			download(s3Client, "title.principals.tsv.gz", actorMovieFile);
		}

		Path moviesFile = Paths.get("./title.basics.tsv.gz");
		if (!Files.exists(moviesFile)) {
			download(s3Client, "title.basics.tsv.gz", moviesFile);
		}

		TsvParserSettings settings = new TsvParserSettings();
		settings.setHeaderExtractionEnabled(true);
		TsvParser parser = new TsvParser(settings);

		MongoClientOptions options = MongoClientOptions.builder()
				.writeConcern(WriteConcern.UNACKNOWLEDGED).build();
		MongoClient mongoClient = new MongoClient("localhost", options);
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

		try (InputStream is = Files.newInputStream(actorMovieFile);
				GZIPInputStream gzIs = new GZIPInputStream(is)) {
			for (Record record : parser.iterateRecords(gzIs)) {
				String movieId = record.getString("tconst");
				String principalCastString = record.getString("principalCast");
				if (principalCastString != null) {
					String[] principalCast = principalCastString.split(",");
					movieUpdates.add(new UpdateOneModel<>(Filters.eq("_id", movieId),
							Updates.addEachToSet("actors",
									Arrays.asList(principalCast))));

					for (String principal : principalCast) {
						actorUpdates
								.add(new UpdateOneModel<>(Filters.eq("_id", principal),
										Updates.addToSet("movies", movieId)));
					}
				}

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

		mongoClient.close();
	}

	private static boolean isNotNull(String text) {
		return StringUtils.hasText(text) && !"\\N".equals(text);
	}

	private static void download(AmazonS3 s3Client, String fileName, Path target)
			throws IOException {
		GetObjectRequest getObjectRequest = new GetObjectRequest("imdb-datasets",
				"documents/v1/current/" + fileName).withRequesterPays(true);

		try (S3Object s3object = s3Client.getObject(getObjectRequest);
				S3ObjectInputStream is = s3object.getObjectContent()) {
			Files.copy(is, target);
		}
	}

}