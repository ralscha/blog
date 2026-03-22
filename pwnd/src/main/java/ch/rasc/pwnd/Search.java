package ch.rasc.pwnd;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import jetbrains.exodus.ArrayByteIterable;
import jetbrains.exodus.ByteIterable;
import jetbrains.exodus.bindings.IntegerBinding;
import jetbrains.exodus.env.Environment;
import jetbrains.exodus.env.Environments;
import jetbrains.exodus.env.Store;
import jetbrains.exodus.env.StoreConfig;

public class Search {

  public static void main(String[] args) {
    try (Environment env = Environments.newInstance("./pwned_db")) {
      for (String pw : List.of("123456", "password", "654321", "qwerty",
          "letmein")) {
        long start = System.nanoTime();
        Integer count = haveIBeenPwned(env, pw);
        if (count != null) {
          System.out.println("I have been pwned. Number of occurrences: " + count);
        }
        else {
          System.out.println("Password not found");
        }
        System.out.println(Duration.ofNanos(System.nanoTime() - start).toMillis() + " ms");
        System.out.println();
      }
    }
  }

  private static Integer haveIBeenPwned(Environment env, String password) {
    byte[] passwordBytes = sha1(password);
    return env.computeInReadonlyTransaction(txn -> {
      Store store = env.openStore("passwords", StoreConfig.WITHOUT_DUPLICATES, txn);
      ByteIterable key = new ArrayByteIterable(passwordBytes);
      ByteIterable bi = store.get(txn, key);
      if (bi != null) {
        return IntegerBinding.compressedEntryToInt(bi);
      }
      return null;
    });
  }

  private static byte[] sha1(String password) {
    try {
      MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");
      return messageDigest.digest(password.getBytes(StandardCharsets.UTF_8));
    }
    catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException("SHA-1 is not available", e);
    }
  }

}
