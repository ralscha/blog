package ch.rasc.beacon;

import java.util.Map;
import java.util.zip.DataFormatException;
import java.util.zip.Inflater;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
public class UsageController {

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/heartbeat")
  public void heartbeat(@RequestParam(name = "id", required = false) Long id) {
    System.out.println(id);
    System.out.println("heartbeat called");
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/usageString")
  public void usageString(@RequestBody String data) {
    System.out.println(data);
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/usageBlob")
  public void usageBlob(@RequestBody Map<String, Object> data) {
    System.out.println(data.get("ua"));
    System.out.println(data.get("now"));
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/usageFormData")
  public void usageFormData(@RequestParam("session") String session,
      @RequestParam("id") long id) {
    System.out.println(session);
    System.out.println(id);
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/usageArrayBufferView")
  public void usageArrayBufferView(@RequestBody byte[] data) throws DataFormatException {
    Inflater decompresser = new Inflater();
    decompresser.setInput(data, 0, data.length);
    byte[] inflated = new byte[2048];
    int resultLength = decompresser.inflate(inflated);
    decompresser.end();

    System.out.println(new String(inflated, 0, resultLength));
  }

}
