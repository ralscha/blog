package ch.rasc.dynamicpos;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.univocity.parsers.common.record.Record;

@Document
public class Earthquake {

  @Id
  private String id;
  private String time;

  @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
  private GeoJsonPoint location;
  private float depth;
  private float mag;
  private String place;

  public Earthquake() {
    // default constructor
  }

  public Earthquake(Record record) {
    this.id = record.getString("id");
    this.time = record.getString("time");
    this.mag = record.getFloat("mag");
    this.depth = record.getFloat("depth");
    this.place = record.getString("place");
    this.location = new GeoJsonPoint(record.getDouble("longitude"),
        record.getDouble("latitude"));
  }

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

  public GeoJsonPoint getLocation() {
    return this.location;
  }

  public void setLocation(GeoJsonPoint location) {
    this.location = location;
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

}
