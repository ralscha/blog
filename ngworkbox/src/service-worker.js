importScripts('workbox-4.3.0/workbox-sw.js');
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'workbox-4.3.0/'
});
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute([]);

