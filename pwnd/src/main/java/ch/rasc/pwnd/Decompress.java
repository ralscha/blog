package ch.rasc.pwnd;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.commons.compress.archivers.sevenz.SevenZArchiveEntry;
import org.apache.commons.compress.archivers.sevenz.SevenZFile;

public class Decompress {

  public static void main(String[] args) throws IOException {
    Path dir = Paths.get("e:/temp");
    Path passwordFile = dir.resolve(Paths.get("pwned-passwords-ordered-by-count.7z"));
    try (SevenZFile sevenZFile = new SevenZFile(passwordFile.toFile())) {
      SevenZArchiveEntry entry = sevenZFile.getNextEntry();
      byte[] buffer = new byte[65536];
      while (entry != null) {
        Path f = dir.resolve(Paths.get(entry.getName()));
        try (OutputStream os = Files.newOutputStream(f)) {
          int count;
          while ((count = sevenZFile.read(buffer, 0, buffer.length)) > -1) {
            os.write(buffer, 0, count);
          }
        }
        entry = sevenZFile.getNextEntry();
      }
    }
  }

}
