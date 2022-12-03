package ch.rasc.googlevision.dto;

public class WebEntity {
  private String entityId;
  private Float score;
  private String description;

  public String getEntityId() {
    return this.entityId;
  }

  public void setEntityId(String entityId) {
    this.entityId = entityId;
  }

  public Float getScore() {
    return this.score;
  }

  public void setScore(Float score) {
    this.score = score;
  }

  public String getDescription() {
    return this.description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

}
