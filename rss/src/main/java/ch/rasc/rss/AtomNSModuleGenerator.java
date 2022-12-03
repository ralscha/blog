package ch.rasc.rss;

import java.util.Collections;
import java.util.Set;

import org.jdom2.Element;
import org.jdom2.Namespace;

import com.rometools.rome.feed.module.Module;
import com.rometools.rome.io.ModuleGenerator;

public class AtomNSModuleGenerator implements ModuleGenerator {
  private static final Namespace ATOM_NS = Namespace.getNamespace("atom",
      AtomNSModule.URI);

  private static final Set<Namespace> NAMESPACES;

  static {
    NAMESPACES = Collections.emptySet();
  }

  @Override
  public String getNamespaceUri() {
    return AtomNSModule.URI;
  }

  @Override
  public Set<Namespace> getNamespaces() {
    return NAMESPACES;
  }

  @Override
  public void generate(Module module, Element element) {
    boolean atomFeed = "feed".equals(element.getName());

    AtomNSModule atomNSModule = (AtomNSModule) module;

    Element atomLink;
    if (atomFeed) {
      atomLink = new Element("link", element.getNamespace());
    }
    else {
      Element root = element;
      while (root.getParent() != null && root.getParent() instanceof Element) {
        root = (Element) element.getParent();
      }
      root.addNamespaceDeclaration(ATOM_NS);
      atomLink = new Element("link", ATOM_NS);
    }
    atomLink.setAttribute("href", atomNSModule.getLink());
    atomLink.setAttribute("rel", "self");
    if (atomFeed) {
      atomLink.setAttribute("type", "application/atom+xml");
    }
    else {
      atomLink.setAttribute("type", "application/rss+xml");
    }

    element.addContent(0, atomLink);
  }

}