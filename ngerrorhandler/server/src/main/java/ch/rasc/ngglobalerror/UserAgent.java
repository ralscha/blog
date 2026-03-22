package ch.rasc.ngglobalerror;

public class UserAgent {

  private String language;

  private boolean online;

  private String platform;

  private String userAgent;

  private Double connectionDownlink;

  private String connectionEffectiveType;

  public UserAgent() {
  }

  public String getLanguage() {
    return this.language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  public boolean isOnline() {
    return this.online;
  }

  public void setOnline(boolean online) {
    this.online = online;
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

  public Double getConnectionDownlink() {
    return this.connectionDownlink;
  }

  public void setConnectionDownlink(Double connectionDownlink) {
    this.connectionDownlink = connectionDownlink;
  }

  public String getConnectionEffectiveType() {
    return this.connectionEffectiveType;
  }

  public void setConnectionEffectiveType(String connectionEffectiveType) {
    this.connectionEffectiveType = connectionEffectiveType;
  }

  @Override
  public String toString() {
    return "UserAgent [language=" + this.language + ", online=" + this.online
        + ", platform=" + this.platform + ", userAgent=" + this.userAgent
        + ", connectionDownlink=" + this.connectionDownlink
        + ", connectionEffectiveType=" + this.connectionEffectiveType + "]";
  }

}
