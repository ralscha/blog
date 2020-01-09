package ch.rasc.jwt.security;

import java.util.Base64;
import java.util.Date;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import ch.rasc.jwt.AppConfig;
import ch.rasc.jwt.db.User;
import ch.rasc.jwt.db.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class TokenProvider {

  private final String secretKey;

  private final long tokenValidityInMilliseconds;

  private final UserService userService;

  public TokenProvider(AppConfig config, UserService userService) {
    this.secretKey = Base64.getEncoder().encodeToString(config.getSecret().getBytes());
    this.tokenValidityInMilliseconds = 1000 * config.getTokenValidityInSeconds();
    this.userService = userService;
  }

  public String createToken(String username) {
    Date now = new Date();
    Date validity = new Date(now.getTime() + this.tokenValidityInMilliseconds);

    return Jwts.builder().setId(UUID.randomUUID().toString()).setSubject(username)
        .setIssuedAt(now).signWith(SignatureAlgorithm.HS512, this.secretKey)
        .setExpiration(validity).compact();
  }

  public Authentication getAuthentication(String token) {
    String username = Jwts.parser().setSigningKey(this.secretKey).parseClaimsJws(token)
        .getBody().getSubject();

    User user = this.userService.lookup(username);
    if (user == null) {
      throw new UsernameNotFoundException("User '" + username + "' not found");
    }

    UserDetails userDetails = org.springframework.security.core.userdetails.User
        .withUsername(username).password("").authorities(Set.of()).accountExpired(false)
        .accountLocked(false).credentialsExpired(false).disabled(false).build();

    return new UsernamePasswordAuthenticationToken(userDetails, null,
        userDetails.getAuthorities());
  }

}
