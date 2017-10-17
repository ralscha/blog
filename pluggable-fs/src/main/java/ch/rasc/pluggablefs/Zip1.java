package ch.rasc.pluggablefs;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Zip1 {

  public static void main(String[] args) throws IOException {
    Map<String, String> env = new HashMap<>();
    env.put("create", "true");
    URI uri = URI.create("jar:file:/test1.zip");

    try (FileSystem fs = FileSystems.newFileSystem(uri, env)) {
      Path p1 = fs.getPath("one.txt");
      List<String> lines = Arrays.asList("one", "two", "three");
      Files.write(p1, lines, StandardCharsets.UTF_8);

      Path p2 = fs.getPath("two.txt");
      Files.copy(p1, p2, StandardCopyOption.REPLACE_EXISTING);

      Path p2b = fs.getPath("two_renamed.txt");
      Files.move(p2, p2b, StandardCopyOption.REPLACE_EXISTING);

      Path dir = fs.getPath("directory");
      Files.createDirectory(dir);

      Path p3 = fs.getPath("directory/three.txt");
      Files.write(p3, Arrays.asList("three"));

      Files.delete(p1);
    }
  }

}
