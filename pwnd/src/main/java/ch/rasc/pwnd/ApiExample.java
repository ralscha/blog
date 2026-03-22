package ch.rasc.pwnd;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

public class ApiExample {

  private static final HexFormat HEX_FORMAT = HexFormat.of().withUpperCase();

  private static final HttpClient HTTP_CLIENT = HttpClient.newHttpClient();

  public static void main(String[] args) throws IOException, InterruptedException {

    String password = "123456";
    String sha1 = sha1Hex(password);
    String prefixHash = sha1.substring(0, 5);
    String suffixHash = sha1.substring(5);

    HttpRequest request = HttpRequest
        .newBuilder(URI.create("https://api.pwnedpasswords.com/range/" + prefixHash))
        .header("Add-Padding", "true").header("User-Agent", "pwnd-java-example")
        .build();
    HttpResponse<String> response = HTTP_CLIENT.send(request,
        HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

    if (response.statusCode() != 200) {
      throw new IOException("Unexpected HTTP status: " + response.statusCode());
    }

    for (String line : response.body().split("\\R")) {
      if (line.startsWith(suffixHash + ":")) {
        System.out
            .println("password found, count: " + line.substring(line.indexOf(':') + 1));
        return;
      }
    }

    System.out.println("password not found");

  }

  private static String sha1Hex(String password) {
    try {
      MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");
      byte[] passwordBytes = messageDigest.digest(password.getBytes(StandardCharsets.UTF_8));
      return HEX_FORMAT.formatHex(passwordBytes);
    }
    catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException("SHA-1 is not available", e);
    }
  }

}
