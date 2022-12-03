package ch.rasc.rss;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rometools.rome.feed.WireFeed;
import com.rometools.rome.feed.atom.Category;
import com.rometools.rome.feed.atom.Content;
import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.atom.Feed;
import com.rometools.rome.feed.atom.Link;
import com.rometools.rome.feed.atom.Person;
import com.rometools.rome.feed.rss.Channel;
import com.rometools.rome.feed.rss.Description;
import com.rometools.rome.feed.rss.Item;
import com.rometools.rome.feed.synd.SyndCategory;
import com.rometools.rome.feed.synd.SyndCategoryImpl;
import com.rometools.rome.feed.synd.SyndContent;
import com.rometools.rome.feed.synd.SyndContentImpl;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndEntryImpl;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.feed.synd.SyndFeedImpl;
import com.rometools.rome.feed.synd.SyndPerson;

@RestController
public class FeedController {

  @GetMapping(path = "/rss")
  public Channel rss() {
    Channel channel = new Channel();
    channel.setFeedType("rss_2.0");
    channel.setTitle("Ralph's Blog");
    channel.setDescription("Blog about this and that");
    channel.setLink("https://golb.hplar.ch/");
    channel.setUri("https://golb.hplar.ch/");

    Date postDate = new Date();
    channel.setPubDate(postDate);

    Item item = new Item();
    item.setAuthor("Ralph");
    item.setLink("https://golb.hplar.ch/p/1");
    item.setTitle("1");
    item.setUri("https://golb.hplar.ch/p/1");

    com.rometools.rome.feed.rss.Category category = new com.rometools.rome.feed.rss.Category();
    category.setValue("tag1");
    item.setCategories(Collections.singletonList(category));

    Description descr = new Description();
    descr.setValue("a short description");
    item.setDescription(descr);
    item.setPubDate(postDate);

    channel.setItems(Collections.singletonList(item));
    return channel;
  }

  @GetMapping(path = "/atom")
  public Feed atom() {
    Feed feed = new Feed();
    feed.setFeedType("atom_1.0");
    feed.setTitle("Ralph's Blog");
    feed.setId("https://golb.hplar.ch/");

    Content subtitle = new Content();
    subtitle.setType("text/plain");
    subtitle.setValue("Blog about this and that");
    feed.setSubtitle(subtitle);

    Date postDate = new Date();
    feed.setUpdated(postDate);

    Entry entry = new Entry();

    Link link = new Link();
    link.setHref("https://golb.hplar.ch/p/1");
    entry.setAlternateLinks(Collections.singletonList(link));
    SyndPerson author = new Person();
    author.setName("Ralph");
    entry.setAuthors(Collections.singletonList(author));
    entry.setCreated(postDate);
    entry.setPublished(postDate);
    entry.setUpdated(postDate);
    entry.setId("https://golb.hplar.ch/p/1");
    entry.setTitle("1");

    Category category = new Category();
    category.setTerm("tag1");
    entry.setCategories(Collections.singletonList(category));

    Content summary = new Content();
    summary.setType("text/plain");
    summary.setValue("a short description");
    entry.setSummary(summary);

    feed.setEntries(Collections.singletonList(entry));
    return feed;
  }

  @GetMapping(path = "/synd_rss")
  public Channel s_rss() {
    return (Channel) createWireFeed("rss_2.0");
  }

  @GetMapping(path = "/synd_atom")
  public Feed s_atom() {
    return (Feed) createWireFeed("atom_1.0");
  }

  private static WireFeed createWireFeed(String feedType) {

    SyndFeed feed;
    if ("rss_2.0".equals(feedType)) {
      feed = new CustomFeedEntry();
    }
    else {
      feed = new SyndFeedImpl();
    }
    feed.setFeedType(feedType);

    feed.setTitle("Ralph's Blog");
    feed.setDescription("Blog about this and that");
    feed.setLink("https://golb.hplar.ch/");
    feed.setAuthor("Ralph");
    feed.setUri("https://golb.hplar.ch/");

    AtomNSModule atomNSModule = new AtomNSModuleImpl();
    String link = "rss_2.0".equals(feedType) ? "/synd_rss" : "/synd_atom";
    atomNSModule.setLink("https://golb.hplar.ch" + link);
    feed.getModules().add(atomNSModule);

    Date publishDate = new Date();

    List<SyndEntry> entries = new ArrayList<>();

    SyndEntry entry;
    if ("rss_2.0".equals(feedType)) {
      entry = new CustomSyndEntry();
    }
    else {
      entry = new SyndEntryImpl();
    }
    entry.setTitle("1");
    entry.setAuthor("Ralph");
    entry.setLink("https://golb.hplar.ch/p/1");
    entry.setUri("https://golb.hplar.ch/p/1");
    entry.setPublishedDate(publishDate);
    entry.setUpdatedDate(publishDate);

    List<SyndCategory> categories = new ArrayList<>();
    SyndCategory category = new SyndCategoryImpl();
    category.setName("tag1");
    categories.add(category);
    entry.setCategories(categories);

    SyndContent description = new SyndContentImpl();
    description.setType("text/plain");
    description.setValue("the summary");
    entry.setDescription(description);

    entries.add(entry);

    feed.setPublishedDate(publishDate);

    feed.setEntries(entries);
    return feed.createWireFeed();
  }

}
