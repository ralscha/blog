import {Component} from '@angular/core';
import {JwtHelper, AuthHttp} from "angular2-jwt";
import {SERVER_URL} from "../../config";
import {AuthProvider} from "../../providers/auth/auth";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: string;
  message: string;

  constructor(private readonly authProvider: AuthProvider,
              jwtHelper: JwtHelper,
              private readonly  authHttp: AuthHttp) {

    this.authProvider.authUser.subscribe(jwt => {
      if (jwt) {
        const decoded = jwtHelper.decodeToken(jwt);
        this.user = decoded.sub
      }
      else {
        this.user = null;
      }
    });

  }

  ionViewWillEnter() {
    this.authHttp.get(`${SERVER_URL}/secret`).subscribe(
      data => this.message = data.text(),
      err => console.log(err)
    );
  }

  logout() {
    this.authProvider.logout();
  }

}
