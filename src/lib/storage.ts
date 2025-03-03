import { openDB, IDBPDatabase, StoreNames, StoreValue, StoreKey } from 'idb';

import type { Schema } from 'types/storage';

class Storage {
  db: Promise<IDBPDatabase<Schema>>;

  constructor() {
    this.db = openDB('wawawa', 1, {
      async upgrade(db) {
        db.createObjectStore('streams', { keyPath: 'id' });
      },
    });
  }

  async get<Name extends StoreNames<Schema>>(name: Name, query: StoreKey<Schema, Name>) {
    const db = await this.db;
    return db.get(name, query);
  }

  async getAll<Name extends StoreNames<Schema>>(name: Name, query: StoreKey<Schema, Name> | IDBKeyRange) {
    const db = await this.db;
    return db.getAll(name, query);
  }

  async add<Name extends StoreNames<Schema>>(name: Name, value: StoreValue<Schema, Name>) {
    const db = await this.db;
    return db.add(name, value);
  }

  async put<Name extends StoreNames<Schema>>(name: Name, value: StoreValue<Schema, Name>) {
    const db = await this.db;
    return db.put(name, value);
  }
}

export default new Storage();
