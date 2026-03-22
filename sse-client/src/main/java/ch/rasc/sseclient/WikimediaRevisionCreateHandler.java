package ch.rasc.sseclient;

import java.io.StringReader;

import com.launchdarkly.eventsource.MessageEvent;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

public class WikimediaRevisionCreateHandler implements DefaultEventHandler {

  @Override
  public void onMessage(String event, MessageEvent messageEvent) throws Exception {
    try (JsonReader jsonReader = Json
        .createReader(new StringReader(messageEvent.getData()))) {
      JsonObject jsonObject = jsonReader.readObject();

      JsonObject meta = jsonObject.getJsonObject("meta");
      if (meta != null && "canary".equals(meta.getString("domain", ""))) {
        return;
      }

      JsonObject performer = jsonObject.getJsonObject("performer");
      String user = performer != null ? performer.getString("user_text", "unknown")
          : "unknown";
      String title = jsonObject.getString("page_title", "");
      long revisionId = jsonObject.getJsonNumber("rev_id").longValue();

      System.out.println(user + " -> " + title + " (rev " + revisionId + ")");
    }
  }

}