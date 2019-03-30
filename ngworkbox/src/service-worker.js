importScripts('workbox-4.1.1/workbox-sw.js');
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'workbox-4.1.1/'
});
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute([]);

