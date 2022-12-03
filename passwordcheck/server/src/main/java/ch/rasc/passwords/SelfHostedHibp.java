package ch.rasc.passwords;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

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

  private final MessageDigest md;

  private final Environment env;

  public SelfHostedHibp() throws NoSuchAlgorithmException {
    this.md = MessageDigest.getInstance("SHA-1");
    this.env = Environments.newInstance("e:/temp/pwnd");
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
      byte[] passwordBytes = this.md.digest(password.getBytes());
      ByteIterable key = new ArrayByteIterable(passwordBytes);
      ByteIterable bi = store.get(txn, key);
      if (bi != null) {
        return IntegerBinding.compressedEntryToInt(bi);
      }
      return null;
    });
  }

  @PostMapping("/selfHostedHibpCheck")
  public int selfHostedHibpCheck(@RequestBody String password) {
    Integer count = haveIBeenPwned(password);
    if (count != null) {
      return count.intValue();
    }
    return 0;
  }

}
