package ch.rasc.googlevision;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "app")
@Component
public class AppConfig {
  private String serviceAccountFile;

  private List<String> origins;

  public String getServiceAccountFile() {
    return this.serviceAccountFile;
  }

  public void setServiceAccountFile(String serviceAccountFile) {
    this.serviceAccountFile = serviceAccountFile;
  }

  public List<String> getOrigins() {
    return this.origins;
  }

  public void setOrigins(List<String> origins) {
    this.origins = origins;
  }

}
