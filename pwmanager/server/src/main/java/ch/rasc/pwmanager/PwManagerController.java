package ch.rasc.pwmanager;

import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class PwManagerController {

	private Map<ByteBuffer, byte[]> db = new ConcurrentHashMap<>();

	@PostMapping("/fetch")
	public byte[] fetch(@RequestBody byte[] authenticationKey) {
		ByteBuffer key = ByteBuffer.wrap(authenticationKey);
		return this.db.get(key);
	}

	@PostMapping("/store")
	public void store(@RequestBody byte[] payload) {
		byte[] keyBytes = Arrays.copyOfRange(payload, 0, 32);
		byte[] value = Arrays.copyOfRange(payload, 32, payload.length);
		ByteBuffer key = ByteBuffer.wrap(keyBytes);
		this.db.put(key, value);
	}

}
