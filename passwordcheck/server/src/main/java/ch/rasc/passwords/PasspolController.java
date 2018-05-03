package ch.rasc.passwords;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.passpol.BreachDatabase;
import com.codahale.passpol.PasswordPolicy;
import com.codahale.passpol.Status;

@RestController
@CrossOrigin
public class PasspolController {

  private final PasswordPolicy policy;

  public PasspolController() {
    this.policy = new PasswordPolicy(BreachDatabase.haveIBeenPwned(), 8, 64);
  }

  @PostMapping("/passpolCheck")
  public Status check(@RequestBody String password) {
    return this.policy.check(password);
  }

}
