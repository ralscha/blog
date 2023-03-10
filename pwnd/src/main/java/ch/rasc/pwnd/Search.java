package ch.rasc.pwnd;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

import jetbrains.exodus.ArrayByteIterable;
import jetbrains.exodus.ByteIterable;
import jetbrains.exodus.bindings.IntegerBinding;
import jetbrains.exodus.env.Environment;
import jetbrains.exodus.env.Environments;
import jetbrains.exodus.env.Store;
import jetbrains.exodus.env.StoreConfig;

public class Search {

  private static MessageDigest md;
  static {
    try {
      md = MessageDigest.getInstance("SHA-1");
    }
    catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
    }
  }

  public static void main(String[] args) {
    try (Environment env = Environments.newInstance("./pwned_db")) {
      for (String pw : Arrays.asList("123456", "password", "654321", "qwerty",
          "letmein")) {
        long start = System.currentTimeMillis();
        Integer count = haveIBeenPwned(env, pw);
        if (count != null) {
          System.out.println("I have been pwned. Number of occurrences: " + count);
        }
        else {
          System.out.println("Password not found");
        }
        System.out.println(System.currentTimeMillis() - start + " ms");
        System.out.println();
      }
    }
  }

  private static Integer haveIBeenPwned(Environment env, String password) {
    return env.computeInReadonlyTransaction(txn -> {
      Store store = env.openStore("passwords", StoreConfig.WITHOUT_DUPLICATES, txn);
      byte[] passwordBytes = md.digest(password.getBytes());
      ByteIterable key = new ArrayByteIterable(passwordBytes);
      ByteIterable bi = store.get(txn, key);
      if (bi != null) {
        return IntegerBinding.compressedEntryToInt(bi);
      }
      return null;
    });
  }

}
