import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {tap} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly jwtTokenName = 'jwt_token';

  private authUser = new ReplaySubject<string | null>(1);
  public authUserObservable = this.authUser.asObservable();

  constructor(private readonly httpClient: HttpClient,
              private readonly navCtrl: NavController,
              private readonly jwtHelper: JwtHelperService) {
  }

  hasAccess(): Promise<boolean> {
    const jwt = localStorage.getItem(this.jwtTokenName);

    if (jwt && !this.jwtHelper.isTokenExpired(jwt)) {

      return new Promise((resolve) => {

        this.httpClient.get(`${environment.serverURL}/authenticate`)
          .subscribe({
            next: () => {
              this.authUser.next(jwt);
              resolve(true);
            },
            error: () => {
              this.logout();
              resolve(false);
            }
          });
      });

      // OR
      // this.authUser.next(jwt);
      // Promise.resolve(true);
    } else {
      this.logout();
      return Promise.resolve(false);
    }
  }

  login(values: { username: string, password: string }): Observable<string> {
    return this.httpClient.post(`${environment.serverURL}/login`, values, {responseType: 'text'})
      .pipe(tap(jwt => this.handleJwtResponse(jwt)));
  }

  logout(): void {
    localStorage.removeItem(this.jwtTokenName);
    this.authUser.next(null);
    this.navCtrl.navigateRoot('login', {replaceUrl: true});
  }

  signup(values: { name: string, email: string, username: string, password: string }): Observable<string> {
    return this.httpClient.post(`${environment.serverURL}/signup`, values, {responseType: 'text'})
      .pipe(tap(jwt => {
        if (jwt !== 'EXISTS') {
          return this.handleJwtResponse(jwt);
        }
        return jwt;
      }));
  }

  private handleJwtResponse(jwt: string): string {
    localStorage.setItem(this.jwtTokenName, jwt);
    this.authUser.next(jwt);

    return jwt;
  }
}
