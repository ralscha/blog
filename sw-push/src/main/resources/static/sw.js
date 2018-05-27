importScripts('https://www.gstatic.com/firebasejs/5.0.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.0.4/firebase-messaging.js');

firebase.initializeApp({
	'messagingSenderId': '220709513681'
});

const messaging = firebase.messaging();

self.addEventListener('push', async event => {
	const db = await getDb();
	const tx = this.db.transaction('jokes', 'readwrite');
	const store = tx.objectStore('jokes');

	const data = event.data.json().data;
	data.id = parseInt(data.id);
	store.put(data);

	tx.oncomplete = async e => {
		const allClients = await clients.matchAll({ includeUncontrolled: true });
		for (const client of allClients) {
			client.postMessage('newData');
		}
	};
});

async function getDb() {
	if (this.db) {
		return Promise.resolve(this.db);
	}

	return new Promise(resolve => {
		const openRequest = indexedDB.open("Chuck", 1);

		openRequest.onupgradeneeded = event => {
			const db = event.target.result;
			db.createObjectStore('jokes', { keyPath: 'id' });
		};

		openRequest.onsuccess = event => {
			this.db = event.target.result;
			resolve(this.db);
		}
	});
}


messaging.setBackgroundMessageHandler(function(payload) {
  const notificationTitle = 'Background Title (client)';
  const notificationOptions = {
    body: 'Background Body (client)',
    icon: '/mail.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});


const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
	'/index.html',
	'/index.js',
	'/mail.png',
	'/mail2.png',
	'/manifest.json'
];

self.addEventListener('install', event => {
	event.waitUntil(caches.open(CACHE_NAME)
		.then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(response => {
				if (response) {
					return response;
				}
				return fetch(event.request);
			}
			)
	);
});


