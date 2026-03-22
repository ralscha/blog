const firebaseConfig = {
  apiKey: 'AIzaSyAMBZJQqEL9ZjA2Y01E0bj9wV4BGZMvdJU',
  authDomain: 'demopush-7dacf.firebaseapp.com',
  projectId: 'demopush-7dacf',
  storageBucket: 'demopush-7dacf.firebasestorage.app',
  messagingSenderId: '425242423819',
  appId: '1:425242423819:web:e34dad8cf7e765216c8d0e'
};

const vapidKey =
    'BE-ASg0VyvsQIxoCzGF7K7cT5Xzj_eJCsnZytY3q71Mwou_5i7S0-9NTQwfpU8wdmZXRb3w7DXSfoXms0QXeybc';

let dbPromise;

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

navigator.serviceWorker.addEventListener('message', event => {
  if (event.data && event.data.type === 'newData') {
    void showData();
  }
});

messaging.onMessage(async payload => {
  if (payload.data) {
    await storeJoke(payload.data);
    await showData();
  }
});

async function init() {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    setStatus('This browser does not support service workers and notifications.');
    return;
  }

  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  document.getElementById('enablePush').addEventListener('click', () => {
    void enablePush(registration);
  });

  if (Notification.permission === 'granted') {
    await syncToken(registration);
    setStatus('Notifications are enabled.');
  }
  else if (Notification.permission === 'denied') {
    setStatus('Notifications are blocked for this site.');
  }
  else {
    setStatus('Click "Enable notifications" to subscribe this browser.');
  }

  await showData();
}

async function enablePush(registration) {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    setStatus('Notification permission was not granted.');
    return;
  }

  await syncToken(registration);
  setStatus('Notifications are enabled.');
}

async function syncToken(registration) {
  try {
    const currentToken = await messaging.getToken({
      vapidKey,
      serviceWorkerRegistration: registration
    });

    if (!currentToken) {
      setStatus('No FCM registration token is available.');
      return;
    }

    if (localStorage.getItem('fcmToken') !== currentToken) {
      await registerToken(currentToken);
      localStorage.setItem('fcmToken', currentToken);
    }
  }
  catch (error) {
    console.error('Unable to subscribe this browser', error);
    setStatus('Unable to subscribe this browser. Check the console for details.');
  }
}

async function registerToken(token) {
  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    },
    body: token
  });

  if (!response.ok) {
    throw new Error(`Token registration failed with status ${response.status}`);
  }
}

async function storeJoke(jokeData) {
  const db = await getDb();
  const transaction = db.transaction('jokes', 'readwrite');
  transaction.objectStore('jokes').put(normalizeJoke(jokeData));
  await waitForTransaction(transaction);
}

async function showData() {
  const db = await getDb();
  const transaction = db.transaction('jokes', 'readonly');
  const store = transaction.objectStore('jokes');
  const jokes = await requestToPromise(store.getAll());
  showJokes(jokes);
}

function showJokes(jokes) {
  const table = document.getElementById('outTable');
  table.replaceChildren();

  jokes.sort((left, right) => right.ts - left.ts);
  for (const joke of jokes) {
    const wrapper = document.createElement('div');
    wrapper.className = 'joke-entry';

    const header = document.createElement('div');
    header.className = 'header';
    header.textContent = `${new Date(joke.ts).toISOString()} ${joke.id} (${joke.seq})`;

    const message = document.createElement('div');
    message.className = 'joke';
    message.textContent = joke.joke;

    wrapper.append(header, message);
    table.append(wrapper);
  }
}

function normalizeJoke(jokeData) {
  return {
    id: String(jokeData.id),
    joke: String(jokeData.joke),
    seq: Number.parseInt(jokeData.seq, 10),
    ts: Number.parseInt(jokeData.ts, 10)
  };
}

function setStatus(message) {
  document.getElementById('status').textContent = message;
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

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function waitForTransaction(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error);
    transaction.onerror = () => reject(transaction.error);
  });
}

void init();