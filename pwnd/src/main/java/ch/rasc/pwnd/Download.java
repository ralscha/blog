package ch.rasc.pwnd;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Duration;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

public class Download {

  private static final String RANGE_API = "https://api.pwnedpasswords.com/range/";

  private static final int MAX_RETRIES = 3;

  private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
      .connectTimeout(Duration.ofSeconds(30)).build();

  public static void main(String[] args) throws IOException {
    int numThreads = Math.max(4, Runtime.getRuntime().availableProcessors() * 2);
    int totalRanges = 0x100000;
    AtomicInteger completedRanges = new AtomicInteger();

    Path outputDir = Path.of("./pwned");
    Files.createDirectories(outputDir);

    try (ExecutorService executor = Executors.newFixedThreadPool(numThreads)) {
      for (int i = 0; i < totalRanges; i++) {
        String range = getRange(i);
        executor.execute(
            () -> downloadRange(range, outputDir, completedRanges, totalRanges));
      }
    }
  }

  private static void downloadRange(String hashPrefix, Path outputDir,
      AtomicInteger completedRanges, int totalRanges) {
    HttpRequest request = HttpRequest.newBuilder(URI.create(RANGE_API + hashPrefix))
        .header("User-Agent", "pwnd-java-downloader")
        .timeout(Duration.ofSeconds(60)).build();

    for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        HttpResponse<byte[]> response = HTTP_CLIENT.send(request,
            HttpResponse.BodyHandlers.ofByteArray());
        if (response.statusCode() != 200) {
          throw new IOException("Unexpected HTTP status: " + response.statusCode());
        }

        Path outputFile = outputDir.resolve(hashPrefix + ".txt");
        Files.write(outputFile, response.body(), StandardOpenOption.CREATE,
            StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.WRITE);
        logProgress(completedRanges.incrementAndGet(), totalRanges);
        return;
      }
      catch (InterruptedException e) {
        Thread.currentThread().interrupt();
        System.err.println("Interrupted while downloading range " + hashPrefix);
        return;
      }
      catch (IOException e) {
        if (attempt == MAX_RETRIES) {
          System.err.println(
              "Failed to download range " + hashPrefix + ": " + e.getMessage());
          return;
        }

        if (!pauseBeforeRetry(attempt, hashPrefix)) {
          return;
        }
      }
    }
  }

  private static boolean pauseBeforeRetry(int attempt, String hashPrefix) {
    try {
      Thread.sleep(Duration.ofSeconds(attempt).toMillis());
      return true;
    }
    catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      System.err.println("Interrupted while waiting to retry range " + hashPrefix);
      return false;
    }
  }

  private static void logProgress(int completedRanges, int totalRanges) {
    if (completedRanges % 10_000 == 0 || completedRanges == totalRanges) {
      System.out.println(
          "Downloaded " + completedRanges + " of " + totalRanges + " ranges");
    }
  }

  private static String getRange(int i) {
    String hex = Integer.toHexString(i);
    return ("00000".substring(hex.length()) + hex).toUpperCase();
  }

}
