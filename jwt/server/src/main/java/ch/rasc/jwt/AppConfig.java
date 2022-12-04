package ch.rasc.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "app")
@Component
public class AppConfig {
  private long tokenValidityInSeconds;

  public long getTokenValidityInSeconds() {
    return this.tokenValidityInSeconds;
  }

  public void setTokenValidityInSeconds(long tokenValidityInSeconds) {
    this.tokenValidityInSeconds = tokenValidityInSeconds;
  }

}
