package ch.rasc.validation;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class RegistrationController {

  private final Set<String> existingUsernames = new HashSet<>();

  RegistrationController() {
    this.existingUsernames.add("admin");
    this.existingUsernames.add("user");
  }

  @GetMapping("/checkUsername")
  public boolean checkUsername(@RequestParam("value") String value) {
    return this.existingUsernames.contains(value);
  }

  @PostMapping("/register")
  public Map<String, Set<String>> register(@Valid @RequestBody Registration registration,
      BindingResult result) {

    Map<String, Set<String>> errors = new HashMap<>();

    if (this.existingUsernames.contains(registration.getUsername())) {
      errors.computeIfAbsent("username", key -> new HashSet<>()).add("usernameTaken");
    }

    for (FieldError fieldError : result.getFieldErrors()) {
      String code = fieldError.getCode();
      String field = fieldError.getField();
      if (code.equals("NotBlank") || code.equals("NotNull")) {
        errors.computeIfAbsent(field, key -> new HashSet<>()).add("required");
      }
      else if (code.equals("Email") && field.equals("email")) {
        errors.computeIfAbsent(field, key -> new HashSet<>()).add("pattern");
      }
      else if (code.equals("Min") && field.equals("age")) {
        errors.computeIfAbsent(field, key -> new HashSet<>()).add("notOldEnough");
      }
      else if (code.equals("Size") && field.equals("username")) {
        if (registration.getUsername().length() < 2) {
          errors.computeIfAbsent(field, key -> new HashSet<>()).add("minlength");
        }
        else {
          errors.computeIfAbsent(field, key -> new HashSet<>()).add("maxlength");
        }
      }
    }

    if (errors.isEmpty()) {
      System.out.println(registration);
    }

    return errors;
  }

}
