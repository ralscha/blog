package ch.rasc.pwnd;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    final long totalLines = 517238891L;

    try (Environment env = Environments.newInstance("e:/temp/pwnd")) {
      env.executeInTransaction((@NotNull final Transaction txn) -> {
        Store store = env.openStore("passwords", StoreConfig.WITHOUT_DUPLICATES, txn);
        Path inputFile = Paths.get("E:/temp/pwned-passwords-ordered-by-count.txt");
        try {
          AtomicLong round = new AtomicLong();
          AtomicLong counter = new AtomicLong();
          Files.lines(inputFile).forEach(line -> {
            long c = counter.incrementAndGet();
            if (c > 10_500_000) {
              txn.flush();
              System.out.printf("Imported: %3.1f%% %n",
                  (double) (round.incrementAndGet() * 10_500_000) / (double) totalLines
                      * 100.0d);
              counter.set(0);
            }
            handleLine(store, txn, line);
          });

          txn.commit();
        }
        catch (IOException e) {
          e.printStackTrace();
        }
      });
    }
  }

  static void handleLine(Store store, Transaction txn, String line) {
    String sha1 = line.substring(0, 40);
    int count = Integer.parseInt(line.substring(41).trim());

    ByteIterable key = new ArrayByteIterable(hexStringToByteArray(sha1));
    store.put(txn, key, IntegerBinding.intToCompressedEntry(count));
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
