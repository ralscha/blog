import {precacheAndRoute} from 'workbox-precaching';
import {skipWaiting, clientsClaim} from 'workbox-core';

declare const self: any;

skipWaiting()
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

