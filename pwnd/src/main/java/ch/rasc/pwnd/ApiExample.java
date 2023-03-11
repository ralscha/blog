package ch.rasc.pwnd;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import jetbrains.exodus.util.HexUtil;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class ApiExample {

  private static MessageDigest md;
  static {
    try {
      md = MessageDigest.getInstance("SHA-1");
    }
    catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
    }
  }

  public static void main(String[] args) throws IOException {

    String password = "123456";
    byte[] passwordBytes = md.digest(password.getBytes());
    String hex = HexUtil.byteArrayToString(passwordBytes).toUpperCase();
    String prefixHash = hex.substring(0, 5);
    String suffixHash = hex.substring(5);

    OkHttpClient client = new OkHttpClient();
    String url = "https://api.pwnedpasswords.com/range/" + prefixHash;

    Request request = new Request.Builder().url(url).build();
    try (Response response = client.newCall(request).execute();
        ResponseBody body = response.body()) {
      String hashes = body.string();
      String[] lines = hashes.split("\\r?\\n");

      for (String line : lines) {
        if (line.startsWith(suffixHash)) {
          System.out
              .println("password found, count: " + line.substring(line.indexOf(":") + 1));
          return;
        }
      }
      System.out.println("password not found");

    }

  }

}
