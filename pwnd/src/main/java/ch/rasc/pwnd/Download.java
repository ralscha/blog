package ch.rasc.pwnd;

import java.io.IOException;
import java.net.InetAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.NoSuchAlgorithmException;

import com.turn.ttorrent.client.Client;
import com.turn.ttorrent.client.SharedTorrent;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class Download {

  public static void main(String[] args) throws IOException, NoSuchAlgorithmException {
    String torrentURL = "https://downloads.pwnedpasswords.com/passwords/pwned-passwords-ordered-by-count.7z.torrent";

    Path torrentFile = Paths.get("e:/temp/pwned.torrent");
    OkHttpClient client = new OkHttpClient();
    Request request = new Request.Builder().url(torrentURL).build();
    try (Response response = client.newCall(request).execute();
        ResponseBody body = response.body()) {
      if (body != null) {
        Files.copy(body.byteStream(), torrentFile, StandardCopyOption.REPLACE_EXISTING);
      }
      else {
        System.out.println("could not download torrent file");
        return;
      }
    }

    Path outputDir = Paths.get("e:/temp");

    Client torrentClient = new Client(InetAddress.getLocalHost(),
        SharedTorrent.fromFile(torrentFile.toFile(), outputDir.toFile()));

    torrentClient.addObserver((observable, data) -> {
      float progress = ((Client) observable).getTorrent().getCompletion();
      System.out.println(progress + "%");
    });

    torrentClient.download();
    torrentClient.waitForCompletion();

  }

}
