package ch.rasc.beacon.dto;

import java.util.List;

public class Analytics {
  private long start;

  private long stop;

  private List<State> visibility;

  public Analytics() {
    // nothing here
  }

  public long getStart() {
    return this.start;
  }

  public void setStart(long start) {
    this.start = start;
  }

  public long getStop() {
    return this.stop;
  }

  public void setStop(long stop) {
    this.stop = stop;
  }

  public List<State> getVisibility() {
    return this.visibility;
  }

  public void setVisibility(List<State> visibility) {
    this.visibility = visibility;
  }

  @Override
  public String toString() {
    return "Analytics [start=" + this.start + ", stop=" + this.stop + ", visibility="
        + this.visibility + "]";
  }

}
