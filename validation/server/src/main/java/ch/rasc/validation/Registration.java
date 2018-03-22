package ch.rasc.validation;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class Registration {

  @NotBlank
  @Size(min = 2, max = 30)
  private String username;

  @NotBlank
  @Email
  private String email;

  @Min(18)
  @NotNull
  private Integer age;

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return this.email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Integer getAge() {
    return this.age;
  }

  public void setAge(Integer age) {
    this.age = age;
  }

  @Override
  public String toString() {
    return "Registration [username=" + this.username + ", email=" + this.email + ", age="
        + this.age + "]";
  }

}
