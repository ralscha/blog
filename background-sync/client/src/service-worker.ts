/// <reference lib="es2018" />
/// <reference lib="webworker" />
import {precacheAndRoute} from 'workbox-precaching';
import {clientsClaim, skipWaiting} from 'workbox-core';
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {Todo, TodoDb} from './app/todo';

declare const self: ServiceWorkerGlobalScope;

const syncURL = 'http://localhost:8080';

skipWaiting();
clientsClaim();

if (process.env.NODE_ENV === 'production') {
  registerRoute(/assets\/icons\/.+\.png$/, new CacheFirst({cacheName: 'icons'}));
  precacheAndRoute(self.__WB_MANIFEST);
}

// Background Sync
const db = new TodoDb();

self.addEventListener('sync', event => {
  if (event.tag === 'todo_updated') {
    event.waitUntil(serverSync());
  }
});

async function serverSync(): Promise<void> {
  const syncViewResponse = await fetch(`${syncURL}/syncview`);
  const syncView = await syncViewResponse.json();

  const serverMap = new Map();
  Object.entries(syncView).forEach(kv => serverMap.set(kv[0], kv[1]));

  const syncRequest: {
    update: Todo[],
    remove: string[],
    get: string[]
  } = {
    update: [],
    remove: [],
    get: []
  };

  const deleteLocal: string[] = [];

  await db.todos.toCollection().each(todo => {
    const serverTimestamp = serverMap.get(todo.id);
    if (serverTimestamp) {
      if (todo.ts === -1) {
        syncRequest.remove.push(todo.id);
      } else if (todo.ts > serverTimestamp) {
        syncRequest.update.push(todo);
      } else if (todo.ts < serverTimestamp) {
        syncRequest.get.push(todo.id);
      }
      serverMap.delete(todo.id);
    } else {
      // not on the server, either insert or delete locally
      if (todo.ts === 0) {
        syncRequest.update.push(todo);
      } else {
        deleteLocal.push(todo.id);
      }
    }
  });

  // all these ids are not in our local database, fetch them
  serverMap.forEach((value, key) => syncRequest.get.push(key));

  // delete local todos
  let deleted = false;
  for (const id of deleteLocal) {
    await db.todos.delete(id);
    deleted = true;
  }

  // if no changes end sync
  if (syncRequest.update.length === 0
    && syncRequest.remove.length === 0
    && syncRequest.get.length === 0) {
    if (deleted) {
      return notifyClients();
    } else {
      return Promise.resolve();
    }
  }

  // send sync request to the server
  const syncResponse = await fetch(`${syncURL}/sync`, {
    method: 'POST',
    body: JSON.stringify(syncRequest),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (syncResponse.status === 200) {
    const sync = await syncResponse.json();

    await db.transaction('rw', db.todos, async () => {
      if (sync.get && sync.get.length > 0) {
        await db.todos.bulkPut(sync.get);
      }

      if (sync.updated) {
        Object.entries(sync.updated).forEach(async (kv) => await db.todos.update(kv[0], {ts: kv[1]}));
      }
      if (sync.removed) {
        sync.removed.forEach(async (id: string) => await db.todos.delete(id));
      }
    });

    return notifyClients();
  }

  return Promise.reject('sync failed: ' + syncResponse.status);
}

async function notifyClients(): Promise<void> {
  const clients = await self.clients.matchAll({includeUncontrolled: true});
  for (const client of clients) {
    client.postMessage('sync_finished');
  }
}
