import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {TodoService} from './todo.service';
import {NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private readonly todoService: TodoService,
              private readonly navCtrl: NavController) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.todoService.hasTodos()) {
      this.navCtrl.navigateRoot('password', {replaceUrl: true});
      return false;
    }

    return true;
  }
}
