package ch.rasc.beacon.dto;

public class State {
  private String state;

  private long ts;

  public State() {
    // nothing here
  }

  public String getState() {
    return this.state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public long getTs() {
    return this.ts;
  }

  public void setTs(long ts) {
    this.ts = ts;
  }

  @Override
  public String toString() {
    return "State [state=" + this.state + ", ts=" + this.ts + "]";
  }

}
