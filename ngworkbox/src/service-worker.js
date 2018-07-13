importScripts('workbox-3.4.1/workbox-sw.js');
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'workbox-3.4.1/'
});
workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.precacheAndRoute([]);

