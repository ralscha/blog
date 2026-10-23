package ch.rasc.pluggablefs;

import java.io.IOException;
import java.net.URI;
import java.nio.CharBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.List;

import org.cryptomator.cryptofs.CryptoFileSystemProperties;
import org.cryptomator.cryptofs.CryptoFileSystemProvider;
import org.cryptomator.cryptolib.api.Masterkey;
import org.cryptomator.cryptolib.api.MasterkeyLoader;
import org.cryptomator.cryptolib.common.MasterkeyFileAccess;

public class Cryptomator {

  public static void main(String[] args) throws IOException {
    Path storageLocation = Paths.get("E:\\temp\\vault");

    Files.createDirectories(storageLocation);
    SecureRandom csprng = new SecureRandom();
    if (System.console() == null) {
      throw new IllegalStateException("Run from a terminal to enter the vault password");
    }
    char[] password = System.console().readPassword("Vault password: ");
    if (password == null || password.length == 0) {
      throw new IllegalArgumentException("A vault password is required");
    }
    MasterkeyFileAccess keyAccess = new MasterkeyFileAccess(new byte[0], csprng);

    try (Masterkey masterkey = Masterkey.generate(csprng)) {
      Path masterKeyPath = storageLocation.resolve("masterkey.cryptomator");
      try (var output = Files.newOutputStream(masterKeyPath, StandardOpenOption.CREATE_NEW)) {
        keyAccess.persist(masterkey, output, CharBuffer.wrap(password), 999);
      }
      MasterkeyLoader loader = keyUri -> keyAccess.load(Paths.get(keyUri), CharBuffer.wrap(password));
      URI uri = masterKeyPath.toUri();
      CryptoFileSystemProperties fsProps = CryptoFileSystemProperties
          .cryptoFileSystemProperties().withKeyLoader(loader).build();
      CryptoFileSystemProvider.initialize(storageLocation, fsProps, uri);
  
      try (FileSystem fs = CryptoFileSystemProvider.newFileSystem(storageLocation,
          CryptoFileSystemProperties.cryptoFileSystemProperties().withKeyLoader(loader)
              .build())) {
  
        Path p1 = fs.getPath("/one.txt");
        List<String> lines = Arrays.asList("one", "two", "three");
        Files.write(p1, lines, StandardCharsets.UTF_8);
  
        Path p2 = fs.getPath("/two.txt");
        Files.copy(p1, p2, StandardCopyOption.REPLACE_EXISTING);
  
        Path p2b = fs.getPath("/two_renamed.txt");
        Files.move(p2, p2b, StandardCopyOption.REPLACE_EXISTING);
  
        Path dir = fs.getPath("/directory");
        Files.createDirectory(dir);
  
        Path p3 = fs.getPath("/directory/three.txt");
        Files.write(p3, Arrays.asList("three"));
  
        Files.delete(p1);
      }
    }
    finally {
      Arrays.fill(password, '\0');
    }
  }

}
