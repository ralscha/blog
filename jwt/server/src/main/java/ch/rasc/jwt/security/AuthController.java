package ch.rasc.jwt.security;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import ch.rasc.jwt.db.User;
import ch.rasc.jwt.db.UserService;

@RestController
@CrossOrigin
public class AuthController {

  private final UserService userService;

  private final TokenProvider tokenProvider;

  private final PasswordEncoder passwordEncoder;

  private final String userNotFoundEncodedPassword;

  public AuthController(PasswordEncoder passwordEncoder, UserService userService,
      TokenProvider tokenProvider) {
    this.userService = userService;
    this.tokenProvider = tokenProvider;
    this.passwordEncoder = passwordEncoder;

    this.userNotFoundEncodedPassword = this.passwordEncoder
        .encode("userNotFoundPassword");
  }

  @GetMapping("/authenticate")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void authenticate() {
    // we don't have to do anything here
    // this is just a secure endpoint and the JWTFilter
    // validates the token
    // this service is called at startup of the app to check
    // if the jwt token is still valid
  }

  @PostMapping("/login")
  public ResponseEntity<String> authorize(@Valid @RequestBody User loginUser) {

    User user = this.userService.lookup(loginUser.getUsername());
    if (user != null) {
      boolean pwMatches = this.passwordEncoder.matches(loginUser.getPassword(),
          user.getPassword());
      if (pwMatches) {
        String token = this.tokenProvider.createToken(loginUser.getUsername());
        return ResponseEntity.ok(token);
      }
    }
    else {
      this.passwordEncoder.matches(loginUser.getPassword(),
          this.userNotFoundEncodedPassword);
    }

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
  }

  @PostMapping("/signup")
  public String signup(@RequestBody User signupUser) {
    if (this.userService.usernameExists(signupUser.getUsername())) {
      return "EXISTS";
    }

    signupUser.encodePassword(this.passwordEncoder);
    this.userService.save(signupUser);
    return this.tokenProvider.createToken(signupUser.getUsername());
  }

}
