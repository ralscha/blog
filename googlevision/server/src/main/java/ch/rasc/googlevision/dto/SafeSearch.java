package ch.rasc.googlevision.dto;

import com.google.cloud.vision.v1.Likelihood;

public class SafeSearch {

  private Likelihood adult;
  private Likelihood spoof;
  private Likelihood medical;
  private Likelihood violence;
  private float adultRating;
  private float spoofRating;
  private float medicalRating;
  private float violenceRating;

  public Likelihood getAdult() {
    return this.adult;
  }

  public void setAdult(Likelihood adult) {
    this.adult = adult;
  }

  public Likelihood getSpoof() {
    return this.spoof;
  }

  public void setSpoof(Likelihood spoof) {
    this.spoof = spoof;
  }

  public Likelihood getMedical() {
    return this.medical;
  }

  public void setMedical(Likelihood medical) {
    this.medical = medical;
  }

  public Likelihood getViolence() {
    return this.violence;
  }

  public void setViolence(Likelihood violence) {
    this.violence = violence;
  }

  public float getAdultRating() {
    return this.adultRating;
  }

  public void setAdultRating(float adultRating) {
    this.adultRating = adultRating;
  }

  public float getSpoofRating() {
    return this.spoofRating;
  }

  public void setSpoofRating(float spoofRating) {
    this.spoofRating = spoofRating;
  }

  public float getMedicalRating() {
    return this.medicalRating;
  }

  public void setMedicalRating(float medicalRating) {
    this.medicalRating = medicalRating;
  }

  public float getViolenceRating() {
    return this.violenceRating;
  }

  public void setViolenceRating(float violenceRating) {
    this.violenceRating = violenceRating;
  }

}
