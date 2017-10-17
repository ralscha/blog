package ch.rasc.jwt;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

  @GetMapping("/public")
  @CrossOrigin
  public String publicService() {
    return "This message is public";
  }

  @GetMapping("/secret")
  @CrossOrigin
  public String secretService() {
    return "A secret message";
  }

}
