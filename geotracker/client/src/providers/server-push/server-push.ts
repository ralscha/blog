import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Position} from "../../position";

@Injectable()
export class ServerPushProvider {
  private serverURL: string = 'https://9bf1e6c6.ngrok.io';

  constructor(private readonly httpClient: HttpClient) {
  }

  pushPosition(pos: Position): void {
    this.httpClient.post(`${this.serverURL}/pos`, pos)
      .subscribe(() => {
      }, error => this.pushError(error));
  }

  pushError(error: string): void {
    this.httpClient.post(`${this.serverURL}/clienterror`, error, {headers: new HttpHeaders({'Content-Type': 'text/plain'})})
      .subscribe(() => {
      }, error => console.log(error));
  }

  clear(): void {
    this.httpClient.delete(`${this.serverURL}/clear`).subscribe(() => {
    }, error => this.pushError(error));
  }

}
