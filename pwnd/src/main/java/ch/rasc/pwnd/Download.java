package ch.rasc.pwnd;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Download {

  private final static String RANGE_API = "https://api.pwnedpasswords.com/range/";

  public static void main(String[] args) throws IOException {
    int numThreads = Runtime.getRuntime().availableProcessors() * 8;

    OkHttpClient httpClient = new OkHttpClient();
    ExecutorService executor = Executors.newFixedThreadPool(numThreads);

    Path outputDir = Paths.get("./pwned");
    Files.createDirectories(outputDir);

    int max = 1024 * 1024;
    for (int i = 0; i < max; i++) {
      String range = getRange(i);
      executor.execute(() -> downloadRange(httpClient, range, outputDir));
    }
  }

  private static void downloadRange(OkHttpClient httpClient, String hashPrefix, Path outputDir) {
    Request request = new Request.Builder().url(RANGE_API + hashPrefix).build();
    try (Response response = httpClient.newCall(request).execute();
        ResponseBody body = response.body()) {
      Files.copy(body.byteStream(), outputDir.resolve(hashPrefix), StandardCopyOption.REPLACE_EXISTING);
    }
    catch (IOException e) {
      e.printStackTrace();
    }
  }

  private static String getRange(int i) {
    String hex = Integer.toHexString(i);
    return ("00000".substring(hex.length()) + hex).toUpperCase();
  }

}
