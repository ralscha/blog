async function init() {

  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;	
  firebase.initializeApp({
    apiKey: "AIzaSyAMBZJQqEL9ZjA2Y01E0bj9wV4BGZMvdJU",
    projectId: "demopush-7dacf",
    messagingSenderId: "425242423819",
    appId: "1:425242423819:web:e34dad8cf7e765216c8d0e"
  });
  const messaging = firebase.messaging();
  messaging.usePublicVapidKey('BE-ASg0VyvsQIxoCzGF7K7cT5Xzj_eJCsnZytY3q71Mwou_5i7S0-9NTQwfpU8wdmZXRb3w7DXSfoXms0QXeybc');
  messaging.useServiceWorker(registration);	
  
  try {
    await messaging.requestPermission();
  } catch (e) {
    console.log('Unable to get permission', e);
    return;
  }

  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data === 'newData') {
      showData();
    }
  });

  const currentToken = await messaging.getToken();
  fetch('/register', { method: 'post', body: currentToken });
  showData();

  messaging.onTokenRefresh(async () => {
    console.log('token refreshed');
    const newToken = await messaging.getToken();
    fetch('/register', { method: 'post', body: currentToken });
  });
  
}

async function showData() {
  const db = await getDb();
  const tx = db.transaction('jokes', 'readonly');
  const store = tx.objectStore('jokes');
  store.getAll().onsuccess = e => showJokes(e.target.result);
}

function showJokes(jokes) {
  const table = document.getElementById('outTable');

  jokes.sort((a, b) => parseInt(b.ts) - parseInt(a.ts));
  const html = [];
  jokes.forEach(j => {
    const date = new Date(parseInt(j.ts));
    html.push(`<div><div class="header">${date.toISOString()} ${j.id} (${j.seq})</div><div class="joke">${j.joke}</div></div>`);
  });
  table.innerHTML = html.join('');
}

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

init();