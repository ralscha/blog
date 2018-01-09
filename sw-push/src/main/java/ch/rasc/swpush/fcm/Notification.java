package ch.rasc.swpush.fcm;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(Include.NON_NULL)
public class Notification {
  private String title;

  private String body;

  private String icon;

  @JsonProperty("click_action")
  private String clickAction;

  public String getTitle() {
    return this.title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getBody() {
    return this.body;
  }

  public void setBody(String body) {
    this.body = body;
  }

  public String getIcon() {
    return this.icon;
  }

  public void setIcon(String icon) {
    this.icon = icon;
  }

  public String getClickAction() {
    return this.clickAction;
  }

  public void setClickAction(String clickAction) {
    this.clickAction = clickAction;
  }

}
