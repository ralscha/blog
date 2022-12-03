package ch.rasc.ngglobalerror;

public class UserAgent {

  private String language;

  private String platform;

  private String userAgent;

  private String connectionType;

  public UserAgent() {
  }

  public String getLanguage() {
    return this.language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  public String getPlatform() {
    return this.platform;
  }

  public void setPlatform(String platform) {
    this.platform = platform;
  }

  public String getUserAgent() {
    return this.userAgent;
  }

  public void setUserAgent(String userAgent) {
    this.userAgent = userAgent;
  }

  public String getConnectionType() {
    return this.connectionType;
  }

  public void setConnectionType(String connectionType) {
    this.connectionType = connectionType;
  }

  @Override
  public String toString() {
    return "UserAgent [language=" + this.language + ", platform=" + this.platform
        + ", userAgent=" + this.userAgent + ", connectionType=" + this.connectionType
        + "]";
  }

}
