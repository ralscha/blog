package ch.rasc.ngglobalerror;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class ErrorController {

  @PostMapping("/clientError")
  public void clientError(@RequestBody List<ClientError> clientErrors) {
    for (ClientError cl : clientErrors) {
      System.out.println(cl);
    }
  }

}
