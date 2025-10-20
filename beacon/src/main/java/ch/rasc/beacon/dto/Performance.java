package ch.rasc.beacon.dto;

public record Performance(
    Double navigationStart,
    Double domContentLoadedEnd,
    Double loadComplete,
    
    Double fcp, // First Contentful Paint
    Double lcp, // Largest Contentful Paint
    Double fid, // First Input Delay

    Long sessionDuration,
    Long timestamp,
    
    Boolean cached,
    Boolean unloaded
) {}
