package ch.rasc.jwt.security;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import ch.rasc.jwt.AppConfig;
import ch.rasc.jwt.db.User;
import ch.rasc.jwt.db.UserService;

@Component
public class TokenProvider {

  private final Algorithm algorithm;

  private final JWTVerifier verifier;

  private final long tokenValidityInMilliseconds;

  private final UserService userService;

  public TokenProvider(AppConfig config, UserService userService) {
    byte[] secret = new byte[64];
    new SecureRandom().nextBytes(secret);
    this.algorithm = Algorithm.HMAC512(secret);
    this.verifier = JWT.require(this.algorithm).build();
    this.tokenValidityInMilliseconds = 1000 * config.getTokenValidityInSeconds();
    this.userService = userService;
  }

  public String createToken(String username) {
    Instant now = Instant.now();
    Instant validity = now.plusMillis(this.tokenValidityInMilliseconds);

    return JWT.create().withJWTId(UUID.randomUUID().toString()).withSubject(username)
        .withIssuedAt(now).withExpiresAt(validity).sign(this.algorithm);
  }

  public Authentication getAuthentication(String token) {
    DecodedJWT decoded = this.verifier.verify(token);
    String username = decoded.getSubject();

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
