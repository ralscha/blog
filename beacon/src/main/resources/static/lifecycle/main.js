const analytics = {
  start: performance.now(),
  stop: null,
  hiddenAt: null
};

let beaconSent = false;

function sendAnalytics(timeStamp) {
  if (beaconSent) {
    return;
  }

  beaconSent = true;
  analytics.stop = performance.now();
  analytics.hiddenAt = timeStamp;
  navigator.sendBeacon('../lifecycle', JSON.stringify(analytics));
}

document.addEventListener('visibilitychange', event => {
  if (document.visibilityState === 'hidden') {
    sendAnalytics(event.timeStamp);
  }
});

window.addEventListener('pagehide', event => {
  sendAnalytics(event.timeStamp);
});

