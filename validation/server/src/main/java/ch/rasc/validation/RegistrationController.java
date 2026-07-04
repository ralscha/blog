package ch.rasc.validation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
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
    return this.existingUsernames.contains(value.toLowerCase());
  }

  @PostMapping("/register")
  public Map<String, List<String>> register(@Valid @RequestBody Registration registration,
      BindingResult result) {

    Map<String, List<String>> errors = new HashMap<>();

    if (registration.getUsername() != null
        && this.existingUsernames.contains(registration.getUsername().toLowerCase())) {
      errors.computeIfAbsent("username", _ -> new ArrayList<>()).add("usernameTaken");
    }

    for (FieldError fieldError : result.getFieldErrors()) {
      errors.computeIfAbsent(fieldError.getField(), _ -> new ArrayList<>())
          .add(toClientError(fieldError));
    }

    if (errors.isEmpty()) {
      System.out.println(registration);
    }

    return errors;
  }

  private static String toClientError(FieldError fieldError) {
    return switch (fieldError.getCode()) {
      case "NotBlank", "NotNull" -> "required";
      case "Email" -> "email";
      case "Min" -> "notOldEnough";
      case "Size" -> {
        if (fieldError.getRejectedValue() instanceof String value && value.length() < 2) {
          yield "minLength";
        }
        yield "maxLength";
      }
      default -> "invalid";
    };
  }

}
