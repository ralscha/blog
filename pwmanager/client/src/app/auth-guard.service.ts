import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {NavController} from '@ionic/angular';
import {PasswordService} from './password.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private readonly passwordService: PasswordService,
              private readonly navCtrl: NavController) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.passwordService.isLoggedIn()) {
      this.navCtrl.navigateRoot('/login', true, {replaceUrl: true});
      return false;
    }

    return true;
  }

}
