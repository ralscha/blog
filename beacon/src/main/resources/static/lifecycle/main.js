const analytics = { start: performance.now(), visibility: [] };

window.addEventListener('unload', event => {
  analytics.stop = performance.now();
  navigator.sendBeacon('../lifecycle', JSON.stringify(analytics));
});

document.addEventListener('visibilitychange', event => {
  analytics.visibility.push({ state: document.visibilityState, ts: event.timeStamp });
});

