import {inject, Injectable} from '@angular/core';
import {UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private readonly authService = inject(AuthService);


  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.hasAccess();
  }

}
