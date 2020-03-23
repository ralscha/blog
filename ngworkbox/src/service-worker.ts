import {precacheAndRoute} from 'workbox-precaching';
import {clientsClaim, skipWaiting} from 'workbox-core';

declare const self: any;

if (process.env.NODE_ENV !== 'production') {
  self.__WB_MANIFEST = [];
}

skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);


