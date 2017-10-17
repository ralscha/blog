package ch.rasc.rss;

import com.rometools.rome.feed.CopyFrom;
import com.rometools.rome.feed.module.ModuleImpl;

public class AtomNSModuleImpl extends ModuleImpl implements AtomNSModule {
  private static final long serialVersionUID = 1L;

  private String link;

  public AtomNSModuleImpl() {
    super(AtomNSModule.class, URI);
  }

  @Override
  public String getLink() {
    return this.link;
  }

  @Override
  public void setLink(String link) {
    this.link = link;
  }

  @Override
  public Class<? extends CopyFrom> getInterface() {
    return AtomNSModule.class;
  }

  @Override
  public void copyFrom(CopyFrom obj) {
    AtomNSModule module = (AtomNSModule) obj;
    module.setLink(this.link);
  }

}