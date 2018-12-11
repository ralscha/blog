package ch.rasc.googlevision.dto;

public class FaceLandmark {
	private com.google.cloud.vision.v1.FaceAnnotation.Landmark.Type type;
	private float x;
	private float y;
	private float z;

	public com.google.cloud.vision.v1.FaceAnnotation.Landmark.Type getType() {
		return this.type;
	}

	public void setType(com.google.cloud.vision.v1.FaceAnnotation.Landmark.Type type) {
		this.type = type;
	}

	public float getX() {
		return this.x;
	}

	public void setX(float x) {
		this.x = x;
	}

	public float getY() {
		return this.y;
	}

	public void setY(float y) {
		this.y = y;
	}

	public float getZ() {
		return this.z;
	}

	public void setZ(float z) {
		this.z = z;
	}

}
