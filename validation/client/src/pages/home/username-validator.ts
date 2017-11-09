import {AbstractControl} from "@angular/forms";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import {SERVER_URL} from "../../config";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class UsernameValidator {

  private timeout;

  constructor(private readonly http: HttpClient) {
  }

  validate(control: AbstractControl): Promise<{[key: string]: boolean}> {
    clearTimeout(this.timeout);

    const value = control.value;

    //do not call server when input is empty or shorter than 2 characters
    if (!value || value.length < 2) {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      this.timeout = setTimeout(() => {
        this.http.get<boolean>(`${SERVER_URL}/checkUsername?value=${control.value}`)
          .subscribe(flag => {
              if (flag) {
                resolve({'usernameTaken': true});
              } else {
                resolve(null);
              }
            },
            (err) => {
              console.log(err);
            }
          )
      }, 200);
    });
  }

}
