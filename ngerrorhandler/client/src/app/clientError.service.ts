import {ClientError, ClientErrorDb} from './clientErrorDb';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientErrorService {

  private db: ClientErrorDb;

  constructor() {
    this.db = new ClientErrorDb();
  }

  async store(body: string): Promise<void> {
    await this.db.errors.add({error: body});
  }

  async delete(ids: number[]): Promise<void> {
    await this.db.errors.bulkDelete(ids);
  }

  async getAll(): Promise<ClientError[]> {
    return this.db.errors.toArray();
  }

}
