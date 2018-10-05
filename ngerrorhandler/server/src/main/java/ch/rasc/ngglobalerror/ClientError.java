package ch.rasc.ngglobalerror;

import java.util.List;

public class ClientError {
  private long ts;
  private UserAgent userAgent;
  private List<StackFrame> stackTrace;

  public ClientError() {
  }

  public long getTs() {
    return this.ts;
  }

  public void setTs(long ts) {
    this.ts = ts;
  }

  public UserAgent getUserAgent() {
    return this.userAgent;
  }

  public void setUserAgent(UserAgent userAgent) {
    this.userAgent = userAgent;
  }

  public List<StackFrame> getStackTrace() {
    return this.stackTrace;
  }

  public void setStackTrace(List<StackFrame> stackTrace) {
    this.stackTrace = stackTrace;
  }

  @Override
  public String toString() {
    return "ClientError [ts=" + this.ts + ", userAgent=" + this.userAgent
        + ", stackTrace=" + this.stackTrace + "]";
  }

}
