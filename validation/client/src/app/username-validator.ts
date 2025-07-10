import {HttpClient} from '@angular/common/http';
import {AbstractControl} from '@angular/forms';
import {environment} from '../environments/environment';
import {inject, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsernameValidator {
  private readonly http = inject(HttpClient);


  private timeout: any = null;

  validate(control: AbstractControl): Promise<{ [key: string]: boolean } | null> {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    const value = control.value;

    // do not call server when input is empty or shorter than 2 characters
    if (!value || value.length < 2) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      this.timeout = setTimeout(() => {
        this.http.get<boolean>(`${environment.serverURL}/checkUsername?value=${control.value}`)
          .subscribe(flag => {
              if (flag) {
                resolve({usernameTaken: true});
              } else {
                resolve(null);
              }
            },
            (err) => {
              console.log(err);
            }
          );
      }, 200);
    });
  }

}
