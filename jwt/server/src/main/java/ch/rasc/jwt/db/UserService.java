package ch.rasc.jwt.db;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final Map<String, User> db;

  public UserService(PasswordEncoder passwordEncoder) {
    this.db = new ConcurrentHashMap<>();

    // add demo user
    User user = new User();
    user.setUsername("admin");
    user.setPassword(passwordEncoder.encode("admin"));
    save(user);
  }

  public User lookup(String username) {
    return this.db.get(username);
  }

  public void save(User user) {
    this.db.put(user.getUsername(), user);
  }

  public boolean usernameExists(String username) {
    return this.db.containsKey(username);
  }
}
