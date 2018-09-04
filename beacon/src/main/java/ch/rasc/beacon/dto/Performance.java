package ch.rasc.beacon.dto;

public class Performance {

  private long connectEnd;
  private long connectStart;
  private long domComplete;
  private long domContentLoadedEventEnd;
  private long domContentLoadedEventStart;
  private long domInteractive;
  private long domLoading;
  private long domainLookupEnd;
  private long domainLookupStart;
  private long fetchStart;
  private long loadEventEnd;
  private long loadEventStart;
  private long navigationStart;
  private long redirectEnd;
  private long redirectStart;
  private long requestStart;
  private long responseEnd;
  private long responseStart;
  private long secureConnectionStart;
  private long unloadEventEnd;
  private long unloadEventStart;

  public Performance() {
  }

  public long getConnectEnd() {
    return this.connectEnd;
  }

  public void setConnectEnd(long connectEnd) {
    this.connectEnd = connectEnd;
  }

  public long getConnectStart() {
    return this.connectStart;
  }

  public void setConnectStart(long connectStart) {
    this.connectStart = connectStart;
  }

  public long getDomComplete() {
    return this.domComplete;
  }

  public void setDomComplete(long domComplete) {
    this.domComplete = domComplete;
  }

  public long getDomContentLoadedEventEnd() {
    return this.domContentLoadedEventEnd;
  }

  public void setDomContentLoadedEventEnd(long domContentLoadedEventEnd) {
    this.domContentLoadedEventEnd = domContentLoadedEventEnd;
  }

  public long getDomContentLoadedEventStart() {
    return this.domContentLoadedEventStart;
  }

  public void setDomContentLoadedEventStart(long domContentLoadedEventStart) {
    this.domContentLoadedEventStart = domContentLoadedEventStart;
  }

  public long getDomInteractive() {
    return this.domInteractive;
  }

  public void setDomInteractive(long domInteractive) {
    this.domInteractive = domInteractive;
  }

  public long getDomLoading() {
    return this.domLoading;
  }

  public void setDomLoading(long domLoading) {
    this.domLoading = domLoading;
  }

  public long getDomainLookupEnd() {
    return this.domainLookupEnd;
  }

  public void setDomainLookupEnd(long domainLookupEnd) {
    this.domainLookupEnd = domainLookupEnd;
  }

  public long getDomainLookupStart() {
    return this.domainLookupStart;
  }

  public void setDomainLookupStart(long domainLookupStart) {
    this.domainLookupStart = domainLookupStart;
  }

  public long getFetchStart() {
    return this.fetchStart;
  }

  public void setFetchStart(long fetchStart) {
    this.fetchStart = fetchStart;
  }

  public long getLoadEventEnd() {
    return this.loadEventEnd;
  }

  public void setLoadEventEnd(long loadEventEnd) {
    this.loadEventEnd = loadEventEnd;
  }

  public long getLoadEventStart() {
    return this.loadEventStart;
  }

  public void setLoadEventStart(long loadEventStart) {
    this.loadEventStart = loadEventStart;
  }

  public long getNavigationStart() {
    return this.navigationStart;
  }

  public void setNavigationStart(long navigationStart) {
    this.navigationStart = navigationStart;
  }

  public long getRedirectEnd() {
    return this.redirectEnd;
  }

  public void setRedirectEnd(long redirectEnd) {
    this.redirectEnd = redirectEnd;
  }

  public long getRedirectStart() {
    return this.redirectStart;
  }

  public void setRedirectStart(long redirectStart) {
    this.redirectStart = redirectStart;
  }

  public long getRequestStart() {
    return this.requestStart;
  }

  public void setRequestStart(long requestStart) {
    this.requestStart = requestStart;
  }

  public long getResponseEnd() {
    return this.responseEnd;
  }

  public void setResponseEnd(long responseEnd) {
    this.responseEnd = responseEnd;
  }

  public long getResponseStart() {
    return this.responseStart;
  }

  public void setResponseStart(long responseStart) {
    this.responseStart = responseStart;
  }

  public long getSecureConnectionStart() {
    return this.secureConnectionStart;
  }

  public void setSecureConnectionStart(long secureConnectionStart) {
    this.secureConnectionStart = secureConnectionStart;
  }

  public long getUnloadEventEnd() {
    return this.unloadEventEnd;
  }

  public void setUnloadEventEnd(long unloadEventEnd) {
    this.unloadEventEnd = unloadEventEnd;
  }

  public long getUnloadEventStart() {
    return this.unloadEventStart;
  }

  public void setUnloadEventStart(long unloadEventStart) {
    this.unloadEventStart = unloadEventStart;
  }

  @Override
  public String toString() {
    return "Performance [connectEnd=" + this.connectEnd + ", connectStart="
        + this.connectStart + ", domComplete=" + this.domComplete
        + ", domContentLoadedEventEnd=" + this.domContentLoadedEventEnd
        + ", domContentLoadedEventStart=" + this.domContentLoadedEventStart
        + ", domInteractive=" + this.domInteractive + ", domLoading=" + this.domLoading
        + ", domainLookupEnd=" + this.domainLookupEnd + ", domainLookupStart="
        + this.domainLookupStart + ", fetchStart=" + this.fetchStart + ", loadEventEnd="
        + this.loadEventEnd + ", loadEventStart=" + this.loadEventStart
        + ", navigationStart=" + this.navigationStart + ", redirectEnd="
        + this.redirectEnd + ", redirectStart=" + this.redirectStart + ", requestStart="
        + this.requestStart + ", responseEnd=" + this.responseEnd + ", responseStart="
        + this.responseStart + ", secureConnectionStart=" + this.secureConnectionStart
        + ", unloadEventEnd=" + this.unloadEventEnd + ", unloadEventStart="
        + this.unloadEventStart + "]";
  }

}
