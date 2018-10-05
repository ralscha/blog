package ch.rasc.ngglobalerror;

public class UserAgent {

  private String language;

  private String platform;

  private String userAgent;

  private int connectionDownlink;

  private String connectionEffectiveType;

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

  public int getConnectionDownlink() {
    return this.connectionDownlink;
  }

  public void setConnectionDownlink(int connectionDownlink) {
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
    return "UserAgent [language=" + this.language + ", platform=" + this.platform
        + ", userAgent=" + this.userAgent + ", connectionDownlink="
        + this.connectionDownlink + ", connectionEffectiveType="
        + this.connectionEffectiveType + "]";
  }

}
