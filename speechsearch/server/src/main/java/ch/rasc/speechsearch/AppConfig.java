package ch.rasc.speechsearch;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "app")
@Component
public class AppConfig {
  private String credentialsPath;
  private String ffmpegPath = "ffmpeg";

  public String getCredentialsPath() {
    return this.credentialsPath;
  }

  public void setCredentialsPath(String credentialsPath) {
    this.credentialsPath = credentialsPath;
  }

  public String getFfmpegPath() {
    return this.ffmpegPath;
  }

  public void setFfmpegPath(String ffmpegPath) {
    this.ffmpegPath = ffmpegPath;
  }

}
