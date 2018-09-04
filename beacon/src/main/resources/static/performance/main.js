window.addEventListener('unload', event => {
  navigator.sendBeacon('../performance', JSON.stringify(performance.timing));
});

