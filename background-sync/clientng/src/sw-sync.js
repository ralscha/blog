(function () {
  'use strict';

  importScripts('dexie.min.js');

  const API_BASE_URL = 'http://localhost:8080';
  const SYNC_TAG = 'todo_updated';

  const db = new Dexie("Todo");

  db.version(1).stores({
    todos: "id,ts"
  });
  db.open();


  self.addEventListener('sync', function (event) {
    if (event.tag === SYNC_TAG) {
      event.waitUntil(serverSync());
    }
  });

  async function serverSync() {
    const syncViewResponse = await fetch(`${API_BASE_URL}/syncview`);
    const syncView = await syncViewResponse.json();

    const serverMap = new Map();
    Object.entries(syncView).forEach(kv => serverMap.set(kv[0], kv[1]));

    const syncRequest = {
      update: [],
      remove: [],
      get: []
    };

    const deleteLocal = [];

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
        //not on the server, either insert or delete locally
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
    const syncResponse = await fetch(`${API_BASE_URL}/sync`, {
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
          await Promise.all(
            Object.entries(sync.updated).map(([id, ts]) => db.todos.update(id, {ts}))
          );
        }
        if (sync.removed && sync.removed.length > 0) {
          await db.todos.bulkDelete(sync.removed);
        }
      });

      return notifyClients();
    }

    throw new Error('sync failed: ' + syncResponse.status);
  }

  async function notifyClients() {
    const clients = await self.clients.matchAll({includeUncontrolled: true});
    for (const client of clients) {
      client.postMessage('sync_finished');
    }
  }

}());
