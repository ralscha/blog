package ch.rasc.protobuf;

public class EarthquakeDto {
  private String id;
  private String time;
  private double latitude;
  private double longitude;
  private float depth;
  private float mag;
  private String place;
  private String magType;

  public String getId() {
    return this.id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getTime() {
    return this.time;
  }

  public void setTime(String time) {
    this.time = time;
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

  public float getDepth() {
    return this.depth;
  }

  public void setDepth(float depth) {
    this.depth = depth;
  }

  public float getMag() {
    return this.mag;
  }

  public void setMag(float mag) {
    this.mag = mag;
  }

  public String getPlace() {
    return this.place;
  }

  public void setPlace(String place) {
    this.place = place;
  }

  public String getMagType() {
    return this.magType;
  }

  public void setMagType(String magType) {
    this.magType = magType;
  }

}
