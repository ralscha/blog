self.addEventListener('install', event => event.waitUntil(loadPictures()));

async function loadPictures() {
  const cache = await caches.open('images');

  const pictures = [
    'https://demo.rasc.ch/img/pexels-photo-127753.jpeg',
    'https://demo.rasc.ch/img/pexels-photo-132037.jpeg',
    'https://demo.rasc.ch/img/pexels-photo-248771.jpeg',
    'https://demo.rasc.ch/img/pexels-photo-248797.jpeg'
  ];
  await cache.addAll(pictures);

  const allClients = await clients.matchAll({includeUncontrolled: true});
  for (const client of allClients) {
    client.postMessage('imagesCached');
  }

}



