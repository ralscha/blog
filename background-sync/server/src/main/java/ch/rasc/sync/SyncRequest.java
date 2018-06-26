package ch.rasc.sync;

import java.util.List;
import java.util.Set;

public class SyncRequest {
  private List<Todo> update;

  private Set<String> remove;

  private Set<String> get;

  public List<Todo> getUpdate() {
    return this.update;
  }

  public void setUpdate(List<Todo> update) {
    this.update = update;
  }

  public Set<String> getRemove() {
    return this.remove;
  }

  public void setRemove(Set<String> remove) {
    this.remove = remove;
  }

  public Set<String> getGet() {
    return this.get;
  }

  public void setGet(Set<String> get) {
    this.get = get;
  }

}
