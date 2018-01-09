package ch.rasc.swpush;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import ch.rasc.swpush.fcm.FcmClient;
import reactor.core.publisher.Mono;

@RestController
@CrossOrigin
public class RegistryController {

  private final FcmClient fcmClient;

  public RegistryController(FcmClient fcmClient) {
    this.fcmClient = fcmClient;
  }

  @PostMapping("/register")
  public void register(@RequestBody Mono<String> token) {
    token.subscribe(t -> this.fcmClient.subscribe("chuck", t));
  }

}
