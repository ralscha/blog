importScripts('workbox-3.4.1/workbox-sw.js');
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'workbox-3.4.1/'
});
workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.precacheAndRoute([]);
workbox.precaching.precacheAndRoute([{
   "url": "assets/fonts/ionicons.woff2?v=4.2.3"
}]);
