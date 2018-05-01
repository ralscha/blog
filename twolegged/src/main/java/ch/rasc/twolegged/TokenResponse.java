package ch.rasc.twolegged;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TokenResponse {
  @JsonProperty("access_token")
  private String accessToken;

  @JsonProperty("token_type")
  private String tokenType;

  @JsonProperty("expires_in")
  private int expiresIn;

  public String getAccessToken() {
    return this.accessToken;
  }

  public void setAccessToken(String accessToken) {
    this.accessToken = accessToken;
  }

  public String getTokenType() {
    return this.tokenType;
  }

  public void setTokenType(String tokenType) {
    this.tokenType = tokenType;
  }

  public int getExpiresIn() {
    return this.expiresIn;
  }

  public void setExpiresIn(int expiresIn) {
    this.expiresIn = expiresIn;
  }

  @Override
  public String toString() {
    return "TokenResponse [accessToken=" + this.accessToken + ", tokenType="
        + this.tokenType + ", expiresIn=" + this.expiresIn + "]";
  }

}
