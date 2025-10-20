const performanceData = {
  navigationStart: null,
  domContentLoadedEnd: null,
  loadComplete: null,
  fcp: null, // First Contentful Paint
  lcp: null, // Largest Contentful Paint
  fid: null, // First Input Delay
  timestamp: null
};

const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const navigationTiming = performance.getEntriesByType('navigation')[0];  
  
  if (navigationTiming) {
    performanceData.navigationStart = navigationTiming.fetchStart;
    performanceData.domContentLoadedEnd = navigationTiming.domContentLoadedEventEnd;
    performanceData.loadComplete = navigationTiming.loadEventEnd;
    performanceData.timestamp = Date.now();
  }
  
  entries.forEach(entry => {
    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          performanceData.fcp = entry.startTime;
        }
        break;
      case 'largest-contentful-paint':
        performanceData.lcp = entry.startTime;
        break;
      case 'first-input':
        performanceData.fid = entry.processingStart - entry.startTime;
        break;
    }
  });
  
  performanceData.timestamp = Date.now();
  navigator.sendBeacon('../performance', JSON.stringify(performanceData));
});

observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input'] });

const sessionStart = Date.now();

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    
    if (navigationTiming) {
      const performanceData = {
        navigationStart: navigationTiming.fetchStart,
        domContentLoadedEnd: navigationTiming.domContentLoadedEventEnd,
        loadComplete: navigationTiming.loadEventEnd,
        sessionDuration: Date.now() - sessionStart,
        timestamp: Date.now()
      };

      navigator.sendBeacon('../performance', JSON.stringify(performanceData));
    }
  }
});


