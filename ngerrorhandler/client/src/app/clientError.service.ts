import { ClientError, ClientErrorDb } from './clientErrorDb';
import { Service } from '@angular/core';

@Service()
export class ClientErrorService {
  private db: ClientErrorDb;

  constructor() {
    this.db = new ClientErrorDb();
  }

  async store(body: string): Promise<void> {
    await this.db.errors.add({ error: body });
  }

  async delete(ids: number[]): Promise<void> {
    await this.db.errors.bulkDelete(ids);
  }

  async getAll(): Promise<ClientError[]> {
    return this.db.errors.toArray();
  }
}
