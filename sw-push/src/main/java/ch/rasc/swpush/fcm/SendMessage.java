package ch.rasc.swpush.fcm;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(Include.NON_NULL)
public class SendMessage {
  private String to;

  private Priority priority;

  @JsonProperty("collapse_key")
  private String collapseKey;

  @JsonProperty("time_to_live")
  private Integer timeToLive;

  private Notification notification;

  private Map<String, Object> data;

  public String getCollapseKey() {
    return this.collapseKey;
  }

  public void setCollapseKey(String collapseKey) {
    this.collapseKey = collapseKey;
  }

  public Integer getTimeToLive() {
    return this.timeToLive;
  }

  public void setTimeToLive(Integer timeToLive) {
    this.timeToLive = timeToLive;
  }

  public Priority getPriority() {
    return this.priority;
  }

  public void setPriority(Priority priority) {
    this.priority = priority;
  }

  public String getTo() {
    return this.to;
  }

  public void setTo(String to) {
    this.to = to;
  }

  public Notification getNotification() {
    return this.notification;
  }

  public void setNotification(Notification notification) {
    this.notification = notification;
  }

  public Map<String, Object> getData() {
    return this.data;
  }

  public void setData(Map<String, Object> data) {
    this.data = data;
  }

}
