importScripts('workbox-500/workbox-sw.js');
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'workbox-500/'
});
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

