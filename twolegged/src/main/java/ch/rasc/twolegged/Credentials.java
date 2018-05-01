package ch.rasc.twolegged;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Credentials {

  @JsonProperty("private_key")
  private String privateKey;

  @JsonProperty("client_email")
  private String clientEmail;

  @JsonProperty("token_uri")
  private String tokenUri;

  public String getPrivateKey() {
    return this.privateKey;
  }

  public void setPrivateKey(String privateKey) {
    this.privateKey = privateKey;
  }

  public String getClientEmail() {
    return this.clientEmail;
  }

  public void setClientEmail(String clientEmail) {
    this.clientEmail = clientEmail;
  }

  public String getTokenUri() {
    return this.tokenUri;
  }

  public void setTokenUri(String tokenUri) {
    this.tokenUri = tokenUri;
  }

}
