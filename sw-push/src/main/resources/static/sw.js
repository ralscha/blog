self.addEventListener('notificationclick', event => {
	event.notification.close();

	event.waitUntil((async () => {
		const existingClients = await clients.matchAll({
			type: 'window',
			includeUncontrolled: true
		});

		for (const client of existingClients) {
			if (client.url.endsWith('/index.html') || client.url.endsWith('/')) {
				await client.focus();
				return;
			}
		}

		await clients.openWindow('/index.html');
	})());
});

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
	apiKey: 'AIzaSyAMBZJQqEL9ZjA2Y01E0bj9wV4BGZMvdJU',
	authDomain: 'demopush-7dacf.firebaseapp.com',
	projectId: 'demopush-7dacf',
	storageBucket: 'demopush-7dacf.firebasestorage.app',
	messagingSenderId: '425242423819',
	appId: '1:425242423819:web:e34dad8cf7e765216c8d0e'
});

const messaging = firebase.messaging();
let dbPromise;

messaging.onBackgroundMessage(async payload => {
	if (payload.data) {
		await storeJoke(payload.data);
		await notifyClients();
	}

	const notification = createNotification(payload);
	await self.registration.showNotification(notification.title, notification.options);
});

async function storeJoke(jokeData) {
	const db = await getDb();
	const transaction = db.transaction('jokes', 'readwrite');
	transaction.objectStore('jokes').put({
		id: String(jokeData.id),
		joke: String(jokeData.joke),
		seq: Number.parseInt(jokeData.seq, 10),
		ts: Number.parseInt(jokeData.ts, 10)
	});
	await waitForTransaction(transaction);
}

async function notifyClients() {
	const allClients = await clients.matchAll({
		type: 'window',
		includeUncontrolled: true
	});

	for (const client of allClients) {
		client.postMessage({ type: 'newData' });
	}
}

function createNotification(payload) {
	const title = payload.notification && payload.notification.title
		? payload.notification.title
		: 'New Chuck Norris joke';

	const body = payload.notification && payload.notification.body
		? payload.notification.body
		: payload.data && payload.data.joke ? payload.data.joke : 'A new joke is available.';

	return {
		title,
		options: {
			body,
			badge: '/mail.png',
			icon: '/mail2.png'
		}
	};
}

async function getDb() {
	if (!dbPromise) {
		dbPromise = new Promise((resolve, reject) => {
			const openRequest = indexedDB.open('Chuck', 1);

			openRequest.onupgradeneeded = event => {
				const db = event.target.result;
				db.createObjectStore('jokes', { keyPath: 'id' });
			};

			openRequest.onsuccess = event => resolve(event.target.result);
			openRequest.onerror = () => reject(openRequest.error);
		});
	}

	return dbPromise;
}

function waitForTransaction(transaction) {
	return new Promise((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onabort = () => reject(transaction.error);
		transaction.onerror = () => reject(transaction.error);
	});
}


