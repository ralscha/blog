package ch.rasc.beacon.dto;

public record Report(
    String id,
    long columnNumber,
    long lineNumber,
    String message,
    String sourceFile
) {}
