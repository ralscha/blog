const CACHE_NAME = 'images-v1';
const PICTURES = [
  'https://cataas.com/cat?width=400&height=300',
  'https://cataas.com/cat?width=500&height=350',
  'https://cataas.com/cat?width=450&height=320',
  'https://cataas.com/cat?width=480&height=360'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(loadPictures());
});

self.addEventListener('activate', event => event.waitUntil(activate()));

async function activate() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames
    .filter(cacheName => cacheName.startsWith('images-') && cacheName !== CACHE_NAME)
    .map(cacheName => caches.delete(cacheName)));
  await clients.claim();
}

async function loadPictures() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(PICTURES);

  const allClients = await clients.matchAll({includeUncontrolled: true});
  for (const client of allClients) {
    client.postMessage('imagesCached');
  }
}
