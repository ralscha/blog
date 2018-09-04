package ch.rasc.beacon.dto;

public class Position {
  private double latitude;

  private double longitude;

  private long ts;

  public Position() {
  }

  public double getLatitude() {
    return this.latitude;
  }

  public void setLatitude(double latitude) {
    this.latitude = latitude;
  }

  public double getLongitude() {
    return this.longitude;
  }

  public void setLongitude(double longitude) {
    this.longitude = longitude;
  }

  public long getTs() {
    return this.ts;
  }

  public void setTs(long ts) {
    this.ts = ts;
  }

  @Override
  public String toString() {
    return "Position [latitude=" + this.latitude + ", longitude=" + this.longitude
        + ", ts=" + this.ts + "]";
  }

}
