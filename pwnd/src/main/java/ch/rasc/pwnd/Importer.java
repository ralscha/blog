package ch.rasc.pwnd;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import org.jetbrains.annotations.NotNull;

import jetbrains.exodus.ArrayByteIterable;
import jetbrains.exodus.ByteIterable;
import jetbrains.exodus.bindings.IntegerBinding;
import jetbrains.exodus.env.Environment;
import jetbrains.exodus.env.Environments;
import jetbrains.exodus.env.Store;
import jetbrains.exodus.env.StoreConfig;
import jetbrains.exodus.env.Transaction;

public class Importer {

  public static void main(String[] args) {

    try (Environment env = Environments.newInstance("./pwned_db")) {
      env.executeInTransaction((@NotNull final Transaction txn) -> {
        Store store = env.openStore("passwords", StoreConfig.WITHOUT_DUPLICATES, txn);
        Path inputDir = Paths.get("./pwned");

        final AtomicLong importCounter = new AtomicLong(0L);
        final AtomicLong fileCounter = new AtomicLong(0L);

        List<String> hashFiles = listAllFiles(inputDir);
        int totalFiles = hashFiles.size();
        for (String hashFile : hashFiles) {
          Path inputFile = inputDir.resolve(Paths.get(hashFile));
          try (var linesReader = Files.lines(inputFile)) {
            linesReader.forEach(line -> {
              long c = importCounter.incrementAndGet();
              if (c > 10_000_000) {
                txn.flush();
                System.out.println(
                    "Processed no of files " + fileCounter.get() + " of " + totalFiles);
                importCounter.set(0L);
              }
              String hashPrefix = hashFile.substring(0, hashFile.lastIndexOf("."));
              handleLine(store, txn, hashPrefix, line);
            });

          }
          catch (IOException e) {
            throw new RuntimeException(e);
          }

          fileCounter.incrementAndGet();
        }

        txn.commit();
      });
    }
  }

  static List<String> listAllFiles(Path inputDir) {
    List<String> files = new ArrayList<>();
    try (var walker = Files.walk(inputDir)) {
      walker.forEach(filePath -> {
        if (Files.isRegularFile(filePath)) {
          files.add(filePath.getFileName().toString());
        }
      });
    }
    catch (IOException e) {
      e.printStackTrace();
    }

    files.sort(String::compareTo);
    return files;
  }

  static void handleLine(Store store, Transaction txn, String prefix, String line) {
    String sha1 = line.substring(0, 35);
    int count = Integer.parseInt(line.substring(36).trim());

    ByteIterable key = new ArrayByteIterable(hexStringToByteArray(prefix + sha1));
    store.putRight(txn, key, IntegerBinding.intToCompressedEntry(count));
  }

  private static byte[] hexStringToByteArray(String s) {
    byte[] data = new byte[20];
    for (int i = 0; i < 40; i += 2) {
      data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
          + Character.digit(s.charAt(i + 1), 16));
    }
    return data;
  }

}
