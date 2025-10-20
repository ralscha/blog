const analytics = { start: performance.now() };

document.addEventListener('visibilitychange', event => {
  analytics.visibility.push({ state: document.visibilityState, ts: event.timeStamp });
  
  if (document.visibilityState === 'hidden') {
    analytics.stop = performance.now();
    analytics.hiddenAt = event.timeStamp;
    navigator.sendBeacon('../lifecycle', JSON.stringify(analytics));
  }
});

