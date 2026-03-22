package ch.rasc.passwords;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.PreDestroy;
import jetbrains.exodus.ArrayByteIterable;
import jetbrains.exodus.ByteIterable;
import jetbrains.exodus.bindings.IntegerBinding;
import jetbrains.exodus.env.Environment;
import jetbrains.exodus.env.Environments;
import jetbrains.exodus.env.Store;
import jetbrains.exodus.env.StoreConfig;

@RestController
@CrossOrigin
public class SelfHostedHibp {

  private final Environment env;

  public SelfHostedHibp(@Value("${passwords.xodus.path}") String databasePath) {
    this.env = Environments.newInstance(Path.of(databasePath).toAbsolutePath().toString());
  }

  @PreDestroy
  public void destroy() {
    if (this.env != null) {
      this.env.close();
    }
  }

  private Integer haveIBeenPwned(String password) {
    return this.env.computeInReadonlyTransaction(txn -> {
      Store store = this.env.openStore("passwords", StoreConfig.WITHOUT_DUPLICATES, txn);
      byte[] passwordBytes = sha1(password);
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
      return MessageDigest.getInstance("SHA-1").digest(password.getBytes(StandardCharsets.UTF_8));
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException("SHA-1 algorithm is not available", e);
    }
  }

  @PostMapping("/selfHostedHibpCheck")
  public int selfHostedHibpCheck(@RequestBody String password) {
    Integer count = haveIBeenPwned(password);
    if (count != null) {
      return count;
    }
    return 0;
  }

}
