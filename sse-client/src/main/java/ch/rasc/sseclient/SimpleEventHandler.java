package ch.rasc.sseclient;

import com.launchdarkly.eventsource.EventHandler;
import com.launchdarkly.eventsource.MessageEvent;

public class SimpleEventHandler implements EventHandler {

  @Override
  public void onOpen() throws Exception {
    System.out.println("onOpen");
  }

  @Override
  public void onClosed() throws Exception {
    System.out.println("onClosed");
  }

  @Override
  public void onMessage(String event, MessageEvent messageEvent) throws Exception {
    System.out.println(messageEvent.getData());
  }

  @Override
  public void onComment(String comment) throws Exception {
    System.out.println("onComment");
  }

  @Override
  public void onError(Throwable t) {
    System.out.println("onError: " + t);
  }

}
