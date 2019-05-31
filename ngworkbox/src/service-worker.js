importScripts('workbox-431/workbox-sw.js');
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'workbox-431/'
});
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute([]);

