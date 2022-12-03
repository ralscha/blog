package ch.rasc.googlevision.dto;

import java.util.List;

import com.google.cloud.vision.v1.Likelihood;

public class Face {

  private Float rollAngle;
  private Float panAngle;
  private Float tiltAngle;
  private Float detectionConfidence;
  private Float landmarkingConfidence;

  private Likelihood joy;
  private Likelihood sorrow;
  private Likelihood anger;
  private Likelihood surprise;
  private Likelihood underExposed;
  private Likelihood blurred;
  private Likelihood headwear;

  private float joyRating;
  private float sorrowRating;
  private float angerRating;
  private float surpriseRating;
  private float underExposedRating;
  private float blurredRating;
  private float headwearRating;

  private List<Vertex> boundingPoly;
  private List<Vertex> fdBoundingPoly;
  private List<FaceLandmark> landmarks;

  public Float getRollAngle() {
    return this.rollAngle;
  }

  public void setRollAngle(Float rollAngle) {
    this.rollAngle = rollAngle;
  }

  public Float getPanAngle() {
    return this.panAngle;
  }

  public void setPanAngle(Float panAngle) {
    this.panAngle = panAngle;
  }

  public Float getTiltAngle() {
    return this.tiltAngle;
  }

  public void setTiltAngle(Float tiltAngle) {
    this.tiltAngle = tiltAngle;
  }

  public Float getDetectionConfidence() {
    return this.detectionConfidence;
  }

  public void setDetectionConfidence(Float detectionConfidence) {
    this.detectionConfidence = detectionConfidence;
  }

  public Float getLandmarkingConfidence() {
    return this.landmarkingConfidence;
  }

  public void setLandmarkingConfidence(Float landmarkingConfidence) {
    this.landmarkingConfidence = landmarkingConfidence;
  }

  public Likelihood getJoy() {
    return this.joy;
  }

  public void setJoy(Likelihood joy) {
    this.joy = joy;
  }

  public Likelihood getSorrow() {
    return this.sorrow;
  }

  public void setSorrow(Likelihood sorrow) {
    this.sorrow = sorrow;
  }

  public Likelihood getAnger() {
    return this.anger;
  }

  public void setAnger(Likelihood anger) {
    this.anger = anger;
  }

  public Likelihood getSurprise() {
    return this.surprise;
  }

  public void setSurprise(Likelihood surprise) {
    this.surprise = surprise;
  }

  public Likelihood getUnderExposed() {
    return this.underExposed;
  }

  public void setUnderExposed(Likelihood underExposed) {
    this.underExposed = underExposed;
  }

  public Likelihood getBlurred() {
    return this.blurred;
  }

  public void setBlurred(Likelihood blurred) {
    this.blurred = blurred;
  }

  public Likelihood getHeadwear() {
    return this.headwear;
  }

  public void setHeadwear(Likelihood headwear) {
    this.headwear = headwear;
  }

  public List<Vertex> getBoundingPoly() {
    return this.boundingPoly;
  }

  public void setBoundingPoly(List<Vertex> boundingPoly) {
    this.boundingPoly = boundingPoly;
  }

  public List<Vertex> getFdBoundingPoly() {
    return this.fdBoundingPoly;
  }

  public void setFdBoundingPoly(List<Vertex> fdBoundingPoly) {
    this.fdBoundingPoly = fdBoundingPoly;
  }

  public List<FaceLandmark> getLandmarks() {
    return this.landmarks;
  }

  public void setLandmarks(List<FaceLandmark> landmarks) {
    this.landmarks = landmarks;
  }

  public float getJoyRating() {
    return this.joyRating;
  }

  public void setJoyRating(float joyRating) {
    this.joyRating = joyRating;
  }

  public float getSorrowRating() {
    return this.sorrowRating;
  }

  public void setSorrowRating(float sorrowRating) {
    this.sorrowRating = sorrowRating;
  }

  public float getAngerRating() {
    return this.angerRating;
  }

  public void setAngerRating(float angerRating) {
    this.angerRating = angerRating;
  }

  public float getSurpriseRating() {
    return this.surpriseRating;
  }

  public void setSurpriseRating(float surpriseRating) {
    this.surpriseRating = surpriseRating;
  }

  public float getUnderExposedRating() {
    return this.underExposedRating;
  }

  public void setUnderExposedRating(float underExposedRating) {
    this.underExposedRating = underExposedRating;
  }

  public float getBlurredRating() {
    return this.blurredRating;
  }

  public void setBlurredRating(float blurredRating) {
    this.blurredRating = blurredRating;
  }

  public float getHeadwearRating() {
    return this.headwearRating;
  }

  public void setHeadwearRating(float headwearRating) {
    this.headwearRating = headwearRating;
  }

}
