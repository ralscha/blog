package ch.rasc.swpush;

import java.util.Arrays;

public class IcndbJoke {
  private String type;
  private Joke value;

  public String getJoke() {
    return this.value.getJoke();
  }

  public String getType() {
    return this.type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Joke getValue() {
    return this.value;
  }

  public void setValue(Joke value) {
    this.value = value;
  }

  @Override
  public String toString() {
    return "IcndbJoke [type=" + this.type + ", value=" + this.value + "]";
  }

  static class Joke {
    private int id;
    private String joke;
    private String[] categories;

    public int getId() {
      return this.id;
    }

    public void setId(int id) {
      this.id = id;
    }

    public String getJoke() {
      return this.joke;
    }

    public void setJoke(String joke) {
      this.joke = joke;
    }

    public String[] getCategories() {
      return this.categories;
    }

    public void setCategories(String[] categories) {
      this.categories = categories;
    }

    @Override
    public String toString() {
      return "Joke [id=" + this.id + ", joke=" + this.joke + ", categories="
          + Arrays.toString(this.categories) + "]";
    }

  }
}