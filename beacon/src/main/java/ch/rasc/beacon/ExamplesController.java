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
import ch.rasc.beacon.dto.WebVitals;

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

    System.out.println("Session Duration: " + (analytics.stop() - analytics.start()) + "ms");

    if (analytics.hiddenAt() != null) {
      System.out.println("Hidden at: " + analytics.hiddenAt() + "ms");
    }

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
    
    if (performance.navigationStart() != null) {
      System.out.println("Navigation Start: " + performance.navigationStart() + "ms");
    }
    if (performance.domContentLoadedEnd() != null) {
      System.out.println("DOM Content Loaded: " + performance.domContentLoadedEnd() + "ms");
    }
    if (performance.loadComplete() != null) {
      System.out.println("Load Complete: " + performance.loadComplete() + "ms");
    }
    
    if (performance.fcp() != null) {
      System.out.println("First Contentful Paint (FCP): " + performance.fcp() + "ms");
    }
    if (performance.lcp() != null) {
      System.out.println("Largest Contentful Paint (LCP): " + performance.lcp() + "ms");
    }
    if (performance.fid() != null) {
      System.out.println("First Input Delay (FID): " + performance.fid() + "ms");
    }
    
    if (performance.sessionDuration() != null) {
      System.out.println("Session Duration: " + performance.sessionDuration() + "ms");
    }
    
    if (performance.cached() != null && performance.cached()) {
      System.out.println("Sent from cached page");
    }
    if (performance.unloaded() != null && performance.unloaded()) {
      System.out.println("Sent during page unload");
    }
    
    System.out.println("Timestamp: " + performance.timestamp());
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

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @PostMapping("/webVitals")
  public void webVitals(@RequestBody String data)
      throws JsonParseException, JsonMappingException, IOException {
    WebVitals webVitals = this.objectMapper.readValue(data, WebVitals.class);
    
    System.out.println("Metric: " + webVitals.name());
    System.out.println("Value: " + webVitals.value());
    System.out.println("Rating: " + webVitals.rating());
    
    if (webVitals.delta() != null) {
      System.out.println("Delta: " + webVitals.delta());
    }
    
    System.out.println("ID: " + webVitals.id());
    
    if (webVitals.navigationType() != null) {
      System.out.println("Navigation Type: " + webVitals.navigationType());
    }
    
    if (webVitals.attribution() != null && !webVitals.attribution().isEmpty()) {
      System.out.println("Attribution: " + webVitals.attribution());
    }
  }
}
