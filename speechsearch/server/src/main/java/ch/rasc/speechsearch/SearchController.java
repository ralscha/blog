package ch.rasc.speechsearch;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.annotation.PreDestroy;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.speech.v1.RecognitionAudio;
import com.google.cloud.speech.v1.RecognitionConfig;
import com.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;
import com.google.cloud.speech.v1.RecognizeResponse;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechRecognitionAlternative;
import com.google.cloud.speech.v1.SpeechRecognitionResult;
import com.google.cloud.speech.v1.SpeechSettings;
import com.google.protobuf.ByteString;
import com.mongodb.MongoClientSettings;
import com.mongodb.WriteConcern;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.builder.FFmpegBuilder;

@RestController
@CrossOrigin
public class SearchController {

  private final MongoClient mongoClient;

  private final MongoDatabase mongoDatabase;

  private final SpeechClient speech;

  public SearchController(AppConfig appConfig) throws IOException {
    MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
        .writeConcern(WriteConcern.UNACKNOWLEDGED)
        .build();
    this.mongoClient = MongoClients.create(mongoClientSettings);
    this.mongoDatabase = this.mongoClient.getDatabase("imdb");

    ServiceAccountCredentials credentials = ServiceAccountCredentials
        .fromStream(Files.newInputStream(Paths.get(appConfig.getCredentialsPath())));
    SpeechSettings settings = SpeechSettings.newBuilder()
        .setCredentialsProvider(FixedCredentialsProvider.create(credentials)).build();
    this.speech = SpeechClient.create(settings);
  }

  @PreDestroy
  public void shutdown() {
    this.mongoClient.close();
    try {
      this.speech.close();
    }
    catch (Exception e) {
      e.printStackTrace();
    }
  }

  @PostMapping("/uploadSpeech")
  public List<String> uploadSpeech(@RequestBody byte[] payloadFromWeb) throws Exception {

    String id = UUID.randomUUID().toString();
    Path inFile = Paths.get("./in" + id + ".wav");
    Path outFile = Paths.get("./out" + id + ".flac");

    Files.write(inFile, payloadFromWeb);

    FFmpeg ffmpeg = new FFmpeg("./ffmpeg.exe");
    FFmpegBuilder builder = new FFmpegBuilder().setInput(inFile.toString())
        .overrideOutputFiles(true).addOutput(outFile.toString())
        .setAudioSampleRate(44_100).setAudioChannels(1)
        .setAudioSampleFormat(FFmpeg.AUDIO_FORMAT_S16).setAudioCodec("flac").done();

    FFmpegExecutor executor = new FFmpegExecutor(ffmpeg);
    executor.createJob(builder).run();

    byte[] payload = Files.readAllBytes(outFile);

    ByteString audioBytes = ByteString.copyFrom(payload);

    RecognitionConfig config = RecognitionConfig.newBuilder()
        .setEncoding(AudioEncoding.FLAC).setLanguageCode("en-US").build();
    RecognitionAudio audio = RecognitionAudio.newBuilder().setContent(audioBytes).build();

    RecognizeResponse response = this.speech.recognize(config, audio);
    List<SpeechRecognitionResult> results = response.getResultsList();

    List<String> searchTerms = new ArrayList<>();
    for (SpeechRecognitionResult result : results) {
      SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
      searchTerms.add(alternative.getTranscript());
    }

    Files.deleteIfExists(inFile);
    Files.deleteIfExists(outFile);

    return searchTerms;
  }

  @SuppressWarnings("unchecked")
  @GetMapping("/search")
  public List<Movie> search(@RequestParam("term") List<String> searchTerms) {

    Set<Movie> results = new HashSet<>();
    MongoCollection<Document> moviesCollection = this.mongoDatabase
        .getCollection("movies");

    MongoCollection<Document> actorCollection = this.mongoDatabase
        .getCollection("actors");

    List<Bson> orQueries = new ArrayList<>();
    for (String term : searchTerms) {
      orQueries.add(Filters.regex("primaryTitle", term + ".*", "i"));
    }

    try (MongoCursor<Document> cursor = moviesCollection.find(Filters.or(orQueries))
        .limit(20).iterator()) {
      while (cursor.hasNext()) {
        Document doc = cursor.next();
        Movie movie = new Movie();
        movie.id = doc.getString("_id");
        movie.title = doc.getString("primaryTitle");
        movie.adult = doc.getBoolean("adultMovie", false);
        movie.genres = doc.getString("genres");
        movie.runtimeMinutes = doc.getInteger("runtimeMinutes", 0);
        movie.actors = getActors(actorCollection, (List<String>) doc.get("actors"));
        results.add(movie);
      }
    }

    return results.stream().collect(Collectors.toList());
  }

  private static List<String> getActors(MongoCollection<Document> actorCollection,
      List<String> actorIds) {
    if (actorIds == null) {
      return Collections.emptyList();
    }

    List<String> result = new ArrayList<>();

    try (MongoCursor<Document> cursor = actorCollection.find(Filters.in("_id", actorIds))
        .iterator()) {
      while (cursor.hasNext()) {
        String name = cursor.next().getString("name");
        if (name != null) {
          result.add(name);
        }
      }
    }

    return result;
  }

}
