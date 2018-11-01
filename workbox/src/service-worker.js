importScripts('workbox-3.6.3/workbox-sw.js');
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'workbox-3.6.3/'
});
workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.precacheAndRoute([]);
workbox.precaching.precacheAndRoute([{
  "url": "https://static.rasc.ch/Workbox-Logo-Grey.svg"
}]);