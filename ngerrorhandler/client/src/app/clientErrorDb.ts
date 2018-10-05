import Dexie from 'dexie';


export class ClientErrorDb extends Dexie {
  errors: Dexie.Table<ClientError, string>;

  constructor() {
    super('ClientErrors');
    this.version(1).stores({
      errors: '++id'
    });
  }
}

export interface ClientError {
  id?: number;
  error: string;
}

