package ch.rasc.beacon;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import ch.rasc.beacon.dto.Analytics;
import ch.rasc.beacon.dto.Performance;
import ch.rasc.beacon.dto.Position;
import ch.rasc.beacon.dto.Report;

@Controller
public class ExamplesController {

  private final ObjectMapper objectMapper;

  public ExamplesController(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/lifecycle")
  public void lifecycle(@RequestBody String data)
      throws JsonParseException, JsonMappingException, IOException {
    Analytics analytics = this.objectMapper.readValue(data, Analytics.class);
    System.out.println(analytics);
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/reportObserver")
  public void reportObserver(@RequestBody String data)
      throws JsonParseException, JsonMappingException, IOException {
    Report report = this.objectMapper.readValue(data, Report.class);
    System.out.println(report);
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/position")
  public void position(@RequestBody String data)
      throws JsonParseException, JsonMappingException, IOException {
    Position location = this.objectMapper.readValue(data, Position.class);
    System.out.println(location);
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/performance")
  public void performance(@RequestBody String data)
      throws JsonParseException, JsonMappingException, IOException {
    Performance performance = this.objectMapper.readValue(data, Performance.class);
    System.out.println(performance);
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/clientError")
  public void clientError(@RequestParam("url") String url, @RequestParam("line") int line,
      @RequestParam("col") int col, @RequestParam("error") String error) {

    System.out.println(error);
    System.out.println(url);
    System.out.println("Line  : " + line);
    System.out.println("Column: " + col);
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/sensor")
  public void sensor(@RequestParam("x") double x, @RequestParam("y") double y,
      @RequestParam("z") double z) {

    System.out.println(x);
    System.out.println(y);
    System.out.println(z);
    System.out.println("===");
  }
}
