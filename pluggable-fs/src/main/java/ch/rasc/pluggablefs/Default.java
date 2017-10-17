package ch.rasc.pluggablefs;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;

public class Default {

  public static void main(String[] args) throws IOException {

    Path p1 = Paths.get("one.txt");
    List<String> lines = Arrays.asList("one", "two", "three");
    Files.write(p1, lines, StandardCharsets.UTF_8);

    Path p2 = Paths.get("two.txt");
    Files.copy(p1, p2, StandardCopyOption.REPLACE_EXISTING);

    Path p2b = Paths.get("two_renamed.txt");
    Files.move(p2, p2b, StandardCopyOption.REPLACE_EXISTING);

    Path dir = Paths.get("directory");
    Files.createDirectory(dir);

    Path p3 = Paths.get("directory/three.txt");
    Files.write(p3, Arrays.asList("three"));

    Files.delete(p1);
  }

}
