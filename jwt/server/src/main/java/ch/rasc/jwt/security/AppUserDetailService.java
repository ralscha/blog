package ch.rasc.jwt.security;

import java.util.Collections;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import ch.rasc.jwt.db.User;
import ch.rasc.jwt.db.UserService;

@Component
public class AppUserDetailService implements UserDetailsService {

  private final UserService userService;

  public AppUserDetailService(UserService userService) {
    this.userService = userService;
  }

  @Override
  public final UserDetails loadUserByUsername(String username)
      throws UsernameNotFoundException {
    final User user = this.userService.lookup(username);
    if (user == null) {
      throw new UsernameNotFoundException("User '" + username + "' not found");
    }

    return org.springframework.security.core.userdetails.User.withUsername(username)
        .password(user.getPassword()).authorities(Collections.emptyList())
        .accountExpired(false).accountLocked(false).credentialsExpired(false)
        .disabled(false).build();
  }

}