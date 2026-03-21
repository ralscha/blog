/// <reference lib="es2018" />
/// <reference lib="webworker" />
import {precacheAndRoute} from 'workbox-precaching';
import {clientsClaim} from 'workbox-core';
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {Todo, TodoDb} from './app/todo';

declare const self: ServiceWorkerGlobalScope;
declare const __SW_IS_PRODUCTION__: boolean;

interface SyncEventWithTag extends ExtendableEvent {
  readonly tag: string;
  readonly lastChance?: boolean;
}

interface SyncRequest {
  update: Todo[];
  remove: string[];
  get: string[];
}

interface SyncResponsePayload {
  get?: Todo[];
  updated?: Record<string, number>;
  removed?: string[];
}

const SYNC_TAG = 'todo_updated';
const TRIGGER_SYNC_MESSAGE = 'trigger_sync';
const SYNC_FINISHED_MESSAGE = 'sync_finished';

const syncURL = 'http://localhost:8080';
let currentSync: Promise<void> | undefined;

self.skipWaiting();
clientsClaim();

if (__SW_IS_PRODUCTION__) {
  registerRoute(/assets\/icons\/.+\.png$/, new CacheFirst({cacheName: 'icons'}));
  precacheAndRoute(self.__WB_MANIFEST);
}

// Background Sync
const db = new TodoDb();

self.addEventListener('sync', event => {
  const syncEvent = event as SyncEventWithTag;
  if (syncEvent.tag === SYNC_TAG) {
    syncEvent.waitUntil(runSync());
  }
});

self.addEventListener('message', event => {
  const messageEvent = event as ExtendableMessageEvent;
  if (messageEvent.data?.type === TRIGGER_SYNC_MESSAGE) {
    messageEvent.waitUntil(runSync());
  }
});

function runSync(): Promise<void> {
  if (!currentSync) {
    currentSync = serverSync().finally(() => {
      currentSync = undefined;
    });
  }

  return currentSync;
}

async function serverSync(): Promise<void> {
  const syncViewResponse = await fetch(`${syncURL}/syncview`);
  const syncView = await syncViewResponse.json() as Record<string, number>;

  const serverMap = new Map<string, number>();
  Object.entries(syncView).forEach(kv => serverMap.set(kv[0], kv[1]));

  const syncRequest: SyncRequest = {
    update: [],
    remove: [],
    get: []
  };

  const deleteLocal: string[] = [];

  await db.todos.toCollection().each(todo => {
    if (serverMap.has(todo.id)) {
      const serverTimestamp = serverMap.get(todo.id) ?? 0;
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
  serverMap.forEach((_value, key) => syncRequest.get.push(key));

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

  if (syncResponse.ok) {
    const sync = await syncResponse.json() as SyncResponsePayload;

    await db.transaction('rw', db.todos, async () => {
      if (sync.get && sync.get.length > 0) {
        await db.todos.bulkPut(sync.get);
      }

      if (sync.updated) {
        for (const kv of Object.entries(sync.updated)) {
          await db.todos.update(kv[0], {ts: kv[1]});
        }
      }
      if (sync.removed) {
        for (const id of sync.removed) {
          await db.todos.delete(id);
        }
      }
    });

    return notifyClients();
  }

  return Promise.reject('sync failed: ' + syncResponse.status);
}

async function notifyClients(): Promise<void> {
  const clients = await self.clients.matchAll({includeUncontrolled: true});
  for (const client of clients) {
    client.postMessage(SYNC_FINISHED_MESSAGE);
  }
}
