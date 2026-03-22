package ch.rasc.twolegged;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Credentials {

  @JsonProperty("private_key")
  private String privateKey;

  @JsonProperty("private_key_id")
  private String privateKeyId;

  @JsonProperty("client_email")
  private String clientEmail;

  @JsonProperty("project_id")
  private String projectId;

  @JsonProperty("token_uri")
  private String tokenUri;

  public String getPrivateKey() {
    return this.privateKey;
  }

  public void setPrivateKey(String privateKey) {
    this.privateKey = privateKey;
  }

  public String getPrivateKeyId() {
    return this.privateKeyId;
  }

  public void setPrivateKeyId(String privateKeyId) {
    this.privateKeyId = privateKeyId;
  }

  public String getClientEmail() {
    return this.clientEmail;
  }

  public void setClientEmail(String clientEmail) {
    this.clientEmail = clientEmail;
  }

  public String getProjectId() {
    return this.projectId;
  }

  public void setProjectId(String projectId) {
    this.projectId = projectId;
  }

  public String getTokenUri() {
    return this.tokenUri;
  }

  public void setTokenUri(String tokenUri) {
    this.tokenUri = tokenUri;
  }

}
