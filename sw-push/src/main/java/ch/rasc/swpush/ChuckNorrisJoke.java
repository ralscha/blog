package ch.rasc.swpush;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ChuckNorrisJoke(String id, String value) {
}