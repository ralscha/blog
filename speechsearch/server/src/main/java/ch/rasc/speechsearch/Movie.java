package ch.rasc.speechsearch;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)
public class Movie {
  public String id;
  public String title;
  public String genres;
  public boolean adult;
  public Integer runtimeMinutes;
  public List<String> actors;
}
