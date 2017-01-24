package ch.rasc.rss;

import java.util.Date;

import com.rometools.rome.feed.synd.SyndFeedImpl;

public class CustomFeedEntry extends SyndFeedImpl {

	private static final long serialVersionUID = 1L;

	protected Date publishedDate;

    @Override
    public Date getPublishedDate() {
        return this.publishedDate;
    }

    @Override
    public void setPublishedDate(final Date publishedDate) {
        this.publishedDate = new Date(publishedDate.getTime());
    }
}