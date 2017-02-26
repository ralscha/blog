package ch.rasc.push;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class PersonalMessageController {

	private final PersonalMessageSender pushSender;

	public PersonalMessageController(PersonalMessageSender pushSender) {
		this.pushSender = pushSender;
	}

	@PostMapping("/register")
	public void register(@RequestParam("token") String token) {
		System.out.println("register: " + token);
		this.pushSender.addToken(token);
	}

	@PostMapping("/unregister")
	public void unregister(@RequestParam("token") String token) {
		System.out.println("unregister: " + token);
		this.pushSender.removeToken(token);
	}

}
