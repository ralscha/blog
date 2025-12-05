package ch.rasc.validation;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

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
      errors.computeIfAbsent("username", _ -> new HashSet<>()).add("usernameTaken");
    }

    for (FieldError fieldError : result.getFieldErrors()) {
      String code = fieldError.getCode();
      String field = fieldError.getField();
      if ("NotBlank".equals(code) || "NotNull".equals(code)) {
        errors.computeIfAbsent(field, _ -> new HashSet<>()).add("required");
      }
      else if ("Email".equals(code) && "email".equals(field)) {
        errors.computeIfAbsent(field, _ -> new HashSet<>()).add("pattern");
      }
      else if ("Min".equals(code) && "age".equals(field)) {
        errors.computeIfAbsent(field, _ -> new HashSet<>()).add("notOldEnough");
      }
      else if ("Size".equals(code) && "username".equals(field)) {
        if (registration.getUsername().length() < 2) {
          errors.computeIfAbsent(field, _ -> new HashSet<>()).add("minlength");
        }
        else {
          errors.computeIfAbsent(field, _ -> new HashSet<>()).add("maxlength");
        }
      }
    }

    if (errors.isEmpty()) {
      System.out.println(registration);
    }

    return errors;
  }

}
