package ch.rasc.googlevision.dto;

import java.util.Objects;

public class Vertex {
  private Integer x;
  private Integer y;

  public Integer getX() {
    return this.x;
  }

  public void setX(Integer x) {
    this.x = x;
  }

  public Integer getY() {
    return this.y;
  }

  public void setY(Integer y) {
    this.y = y;
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.x, this.y);
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if ((obj == null) || (getClass() != obj.getClass())) {
      return false;
    }
    Vertex other = (Vertex) obj;
    return Objects.equals(this.x, other.x) && Objects.equals(this.y, other.y);
  }

}
