import {precacheAndRoute} from 'workbox-precaching';
import {clientsClaim, skipWaiting} from 'workbox-core';
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';

declare const self: any;

if (process.env.NODE_ENV !== 'production') {
  self.__WB_MANIFEST = [];
}

skipWaiting();
clientsClaim();

registerRoute(
  /assets\/images\/icons\/icon-.+\.png$/,
  new CacheFirst({
    cacheName: 'icons'
  })
);

precacheAndRoute(self.__WB_MANIFEST);


