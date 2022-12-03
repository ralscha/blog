package ch.rasc.googlevision;

public class SignUrlResponse {
  private final String uuid;

  private final String url;

  public SignUrlResponse(String uuid, String url) {
    this.uuid = uuid;
    this.url = url;
  }

  public String getUuid() {
    return this.uuid;
  }

  public String getUrl() {
    return this.url;
  }

}
