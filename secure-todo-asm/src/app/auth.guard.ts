import {Injectable} from '@angular/core';
import {UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {TodoService} from './todo.service';
import {NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private readonly todoService: TodoService,
              private readonly navCtrl: NavController) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.todoService.hasTodos()) {
      this.navCtrl.navigateRoot('password', {replaceUrl: true});
      return false;
    }
    return true;
  }
}
