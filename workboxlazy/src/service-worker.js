importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new self.WorkboxSW({clientsClaim: true, skipWaiting: true});

workboxSW.router.registerRoute(new RegExp('.*'), workboxSW.strategies.networkFirst({
  cacheName: 'network'
}));

workboxSW.router.registerRoute(new RegExp('.*/assets/.*'), workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'stale'
}));

workboxSW.router.registerRoute(new RegExp('.+\.[a-f0-9]{10}\..+'), workboxSW.strategies.cacheFirst({
  cacheName: 'cacheFirst',
  cacheExpiration: {
    maxEntries: 40
  }
}));

