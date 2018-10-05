package ch.rasc.ngglobalerror;

public class StackFrame {

  private String fileName;

  private String functionName;

  private int columnNumber;

  private int lineNumber;

  public StackFrame() {
  }

  public String getFileName() {
    return this.fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public String getFunctionName() {
    return this.functionName;
  }

  public void setFunctionName(String functionName) {
    this.functionName = functionName;
  }

  public int getColumnNumber() {
    return this.columnNumber;
  }

  public void setColumnNumber(int columnNumber) {
    this.columnNumber = columnNumber;
  }

  public int getLineNumber() {
    return this.lineNumber;
  }

  public void setLineNumber(int lineNumber) {
    this.lineNumber = lineNumber;
  }

  @Override
  public String toString() {
    return "StackFrame [fileName=" + this.fileName + ", functionName=" + this.functionName
        + ", columnNumber=" + this.columnNumber + ", lineNumber=" + this.lineNumber + "]";
  }

}
