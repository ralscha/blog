self.addEventListener('install', event => event.waitUntil(loadPictures()));

async function loadPictures() {
  const cache = await caches.open('images');

  const pictures = [
    'https://cataas.com/cat?width=400&height=300',
    'https://cataas.com/cat?width=500&height=350',
    'https://cataas.com/cat?width=450&height=320',
    'https://cataas.com/cat?width=480&height=360'
  ];
  await cache.addAll(pictures);

  const allClients = await clients.matchAll({includeUncontrolled: true});
  for (const client of allClients) {
    client.postMessage('imagesCached');
  }

}
