/// <reference lib="es2018" />
/// <reference lib="webworker" />
import {precacheAndRoute} from 'workbox-precaching';
import {clientsClaim, skipWaiting} from 'workbox-core';
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

skipWaiting();
clientsClaim();

if (process.env.NODE_ENV === 'production') {
  registerRoute(
    /assets\/images\/icons\/icon-.+\.png$/,
    new CacheFirst({
      cacheName: 'icons'
    })
  );

  precacheAndRoute(self.__WB_MANIFEST);
}

