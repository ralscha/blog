package ch.rasc.sseclient;

import java.io.StringReader;

import com.launchdarkly.eventsource.MessageEvent;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.json.JsonValue;

public class WikipediaChangeHandler implements DefaultEventHandler {

  @Override
  public void onMessage(String event, MessageEvent messageEvent) throws Exception {
    // System.out.println(messageEvent.getData());

    try (JsonReader jsonReader = Json
        .createReader(new StringReader(messageEvent.getData()))) {
      JsonObject jsonObject = jsonReader.readObject();
      JsonValue title = jsonObject.getValue("/title");
      JsonValue changeType = jsonObject.getValue("/type");
      System.out.println(changeType.toString() + " : " + title.toString());
    }

  }

}
