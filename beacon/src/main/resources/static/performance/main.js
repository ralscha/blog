const performanceData = {
  navigationStart: null,
  domContentLoadedEnd: null,
  loadComplete: null,
  fcp: null,
  lcp: null,
  cls: 0,
  inp: null,
  sessionDuration: null,
  timestamp: null
};

const sessionStart = performance.now();
let beaconSent = false;

function updateNavigationTiming() {
  const navigationTiming = performance.getEntriesByType('navigation')[0];
  if (!navigationTiming) {
    return;
  }

  performanceData.navigationStart = navigationTiming.fetchStart;
  performanceData.domContentLoadedEnd = navigationTiming.domContentLoadedEventEnd;
  performanceData.loadComplete = navigationTiming.loadEventEnd;
}

function observeEntry(type, callback, options = {}) {
  if (!PerformanceObserver.supportedEntryTypes.includes(type)) {
    return null;
  }

  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      callback(entry);
    }
  });

  observer.observe({ type, buffered: true, ...options });
  return observer;
}

const observers = [
  observeEntry('paint', entry => {
    if (entry.name === 'first-contentful-paint') {
      performanceData.fcp = entry.startTime;
    }
  }),
  observeEntry('largest-contentful-paint', entry => {
    performanceData.lcp = entry.startTime;
  }),
  observeEntry('layout-shift', entry => {
    if (!entry.hadRecentInput) {
      performanceData.cls += entry.value;
    }
  }),
  observeEntry('event', entry => {
    if (entry.interactionId > 0) {
      performanceData.inp = Math.max(performanceData.inp ?? 0, entry.duration);
    }
  }, { durationThreshold: 40 })
].filter(Boolean);

function sendPerformance() {
  if (beaconSent) {
    return;
  }

  beaconSent = true;
  updateNavigationTiming();
  performanceData.sessionDuration = Math.round(performance.now() - sessionStart);
  performanceData.timestamp = Date.now();

  navigator.sendBeacon('../performance', JSON.stringify(performanceData));

  for (const observer of observers) {
    observer.disconnect();
  }
}

updateNavigationTiming();

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    sendPerformance();
  }
});

window.addEventListener('pagehide', () => {
  sendPerformance();
});


