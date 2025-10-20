package ch.rasc.beacon.dto;

public record WebVitals(
    String name,
    Double value,
    String rating,
    Double delta,
    String id,
    String navigationType,
    String attribution
) {}