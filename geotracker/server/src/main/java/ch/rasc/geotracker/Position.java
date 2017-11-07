package ch.rasc.geotracker;

public class Position {

  private Double accuracy;

  private Double bearing;

  private double latitude;

  private double longitude;

  private Double speed;

  private long time;

  public Double getAccuracy() {
    return this.accuracy;
  }

  public void setAccuracy(Double accuracy) {
    this.accuracy = accuracy;
  }

  public Double getBearing() {
    return this.bearing;
  }

  public void setBearing(Double bearing) {
    this.bearing = bearing;
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

  public Double getSpeed() {
    return this.speed;
  }

  public void setSpeed(Double speed) {
    this.speed = speed;
  }

  public long getTime() {
    return this.time;
  }

  public void setTime(long time) {
    this.time = time;
  }

}
