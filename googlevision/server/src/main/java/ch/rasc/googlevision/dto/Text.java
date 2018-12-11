package ch.rasc.googlevision.dto;

import java.util.List;
import java.util.Objects;

public class Text {

	private String description;

	private List<Vertex> boundingPoly;

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<Vertex> getBoundingPoly() {
		return this.boundingPoly;
	}

	public void setBoundingPoly(List<Vertex> boundingPoly) {
		this.boundingPoly = boundingPoly;
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.boundingPoly, this.description);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		Text other = (Text) obj;
		return Objects.equals(this.boundingPoly, other.boundingPoly)
				&& Objects.equals(this.description, other.description);
	}

}
