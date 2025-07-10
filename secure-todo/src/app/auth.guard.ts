import {inject, Injectable} from '@angular/core';
import {UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {TodoService} from './todo.service';
import {NavController} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private readonly todoService = inject(TodoService);
  private readonly navCtrl = inject(NavController);


  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.todoService.hasTodos()) {
      this.navCtrl.navigateRoot('password', {replaceUrl: true});
      return false;
    }
    return true;
  }
}
