importScripts('workbox-sw.prod.v2.1.3.js');

const workboxSW = new self.WorkboxSW({clientsClaim: true, skipWaiting: true});
workboxSW.precache([]);
workboxSW.precache([{
   "url": "assets/fonts/ionicons.woff2?v=3.0.0-alpha.3"
 }
]);
