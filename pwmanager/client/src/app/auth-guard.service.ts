import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { inject, Service } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { PasswordService } from './password.service';

@Service()
export class AuthGuard {
  private readonly passwordService = inject(PasswordService);
  private readonly navCtrl = inject(NavController);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.passwordService.isLoggedIn()) {
      this.navCtrl.navigateRoot('/login', { replaceUrl: true });
      return false;
    }
    return true;
  }
}
