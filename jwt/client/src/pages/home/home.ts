import {Component} from '@angular/core';
import {AuthService} from "../../providers/auth-service";
import {JwtHelper, AuthHttp} from "angular2-jwt";
import {SERVER_URL} from "../../config";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: string;
  message: string;

  constructor(private readonly authService: AuthService,
              private readonly jwtHelper: JwtHelper,
              private readonly  authHttp: AuthHttp) {

    this.authService.authUser.subscribe(jwt => {
      if (jwt) {
        const decoded = this.jwtHelper.decodeToken(jwt);
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
    this.authService.logout();
  }

}
