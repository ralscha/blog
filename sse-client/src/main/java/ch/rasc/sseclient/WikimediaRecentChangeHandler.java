package ch.rasc.sseclient;

import java.io.StringReader;

import com.launchdarkly.eventsource.MessageEvent;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

public class WikimediaRecentChangeHandler implements DefaultEventHandler {

  @Override
  public void onMessage(String event, MessageEvent messageEvent) throws Exception {
    try (JsonReader jsonReader = Json
        .createReader(new StringReader(messageEvent.getData()))) {
      JsonObject jsonObject = jsonReader.readObject();

      JsonObject meta = jsonObject.getJsonObject("meta");
      if (meta != null && "canary".equals(meta.getString("domain", ""))) {
        return;
      }

      String title = jsonObject.getString("title", "");
      String changeType = jsonObject.getString("type", "unknown");
      System.out.println(changeType + " : " + title);
    }
  }

}