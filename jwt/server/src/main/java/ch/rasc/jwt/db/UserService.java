package ch.rasc.jwt.db;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final Map<String, User> db;

  public UserService() {
    this.db = new ConcurrentHashMap<>();
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
