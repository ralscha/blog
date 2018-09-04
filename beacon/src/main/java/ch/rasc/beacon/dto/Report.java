package ch.rasc.beacon.dto;

public class Report {

  private String id;

  private long columnNumber;

  private long lineNumber;

  private String message;

  private String sourceFile;

  public Report() {
  }

  public String getId() {
    return this.id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public long getColumnNumber() {
    return this.columnNumber;
  }

  public void setColumnNumber(long columnNumber) {
    this.columnNumber = columnNumber;
  }

  public long getLineNumber() {
    return this.lineNumber;
  }

  public void setLineNumber(long lineNumber) {
    this.lineNumber = lineNumber;
  }

  public String getMessage() {
    return this.message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getSourceFile() {
    return this.sourceFile;
  }

  public void setSourceFile(String sourceFile) {
    this.sourceFile = sourceFile;
  }

  @Override
  public String toString() {
    return "Report [id=" + this.id + ", columnNumber=" + this.columnNumber
        + ", lineNumber=" + this.lineNumber + ", message=" + this.message
        + ", sourceFile=" + this.sourceFile + "]";
  }

}
