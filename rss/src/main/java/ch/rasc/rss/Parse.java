package ch.rasc.rss;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.FeedException;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;

public class Parse {
  public static void main(String[] args)
      throws IllegalArgumentException, MalformedURLException, FeedException, IOException {
    String url = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.atom";

    try (XmlReader reader = new XmlReader(new URL(url))) {
      SyndFeed feed = new SyndFeedInput().build(reader);
      System.out.println(feed.getTitle());
      System.out.println("=======================");
      for (SyndEntry entry : feed.getEntries()) {
        System.out.println(entry);
        System.out.println("======================================");
      }
    }
  }
}
