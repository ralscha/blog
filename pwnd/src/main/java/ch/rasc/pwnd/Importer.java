package ch.rasc.pwnd;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.HexFormat;

import jetbrains.exodus.ArrayByteIterable;
import jetbrains.exodus.bindings.IntegerBinding;
import jetbrains.exodus.env.Environment;
import jetbrains.exodus.env.Environments;
import jetbrains.exodus.env.Store;
import jetbrains.exodus.env.StoreConfig;
import jetbrains.exodus.env.Transaction;

public class Importer {

  private static final HexFormat HEX_FORMAT = HexFormat.of();

  private static final long FLUSH_INTERVAL = 10_000_000L;

  public static void main(String[] args) {
    Path inputDir = Path.of("./pwned");

    try (Environment env = Environments.newInstance("./pwned_db")) {
      env.executeInTransaction(txn -> importFiles(env, txn, inputDir));
    }
  }

  private static void importFiles(Environment env, Transaction txn, Path inputDir) {
    Store store = env.openStore("passwords", StoreConfig.WITHOUT_DUPLICATES, txn);
    List<Path> hashFiles = listAllFiles(inputDir);
    long importedEntries = 0L;
    int processedFiles = 0;

    for (Path inputFile : hashFiles) {
      String hashPrefix = fileNameWithoutExtension(inputFile);
      try (BufferedReader reader = Files.newBufferedReader(inputFile,
          StandardCharsets.US_ASCII)) {
        String line;
        while ((line = reader.readLine()) != null) {
          handleLine(store, txn, hashPrefix, line);
          importedEntries++;
          if (importedEntries % FLUSH_INTERVAL == 0) {
            txn.flush();
            System.out.println(
                "Processed " + processedFiles + " of " + hashFiles.size() + " files");
          }
        }
      }
      catch (IOException e) {
        throw new RuntimeException("Unable to read " + inputFile, e);
      }

      processedFiles++;
    }

    txn.commit();
  }

  static List<Path> listAllFiles(Path inputDir) {
    try (var files = Files.list(inputDir)) {
      return files.filter(Files::isRegularFile)
          .sorted(Comparator.comparing(path -> path.getFileName().toString())).toList();
    }
    catch (IOException e) {
      throw new RuntimeException("Unable to list files in " + inputDir, e);
    }
  }

  static void handleLine(Store store, Transaction txn, String prefix, String line) {
    int separator = line.indexOf(':');
    String sha1 = prefix + line.substring(0, separator);
    int count = Integer.parseInt(line.substring(separator + 1).trim());

    store.putRight(txn, new ArrayByteIterable(HEX_FORMAT.parseHex(sha1)),
        IntegerBinding.intToCompressedEntry(count));
  }

  private static String fileNameWithoutExtension(Path path) {
    String fileName = path.getFileName().toString();
    return fileName.substring(0, fileName.lastIndexOf('.'));
  }

}
