package ch.rasc.rss;

import com.rometools.rome.feed.module.Module;

public interface AtomNSModule extends Module {
  String URI = "http://www.w3.org/2005/Atom";

  String getLink();

  void setLink(String href);
}