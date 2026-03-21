package ch.rasc.beacon.dto;

public record Performance(
    Double navigationStart,
    Double domContentLoadedEnd,
    Double loadComplete,
    
    Double fcp, // First Contentful Paint
    Double lcp, // Largest Contentful Paint
    Double cls, // Cumulative Layout Shift
    Double inp, // Interaction to Next Paint

    Long sessionDuration,
    Long timestamp,
    
    Boolean cached,
    Boolean unloaded
) {}
