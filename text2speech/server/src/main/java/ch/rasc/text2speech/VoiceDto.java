package ch.rasc.text2speech;

public class VoiceDto {
  private final String name;
  private final String gender;
  private final String language;

  public VoiceDto(String language, String name, String gender) {
    this.language = language;
    this.name = name;
    this.gender = gender;
  }

  public String getLanguage() {
    return this.language;
  }

  public String getName() {
    return this.name;
  }

  public String getGender() {
    return this.gender;
  }

}
