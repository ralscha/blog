package ch.rasc.sseclient;

import java.io.StringReader;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.JsonValue;

import com.launchdarkly.eventsource.MessageEvent;

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
