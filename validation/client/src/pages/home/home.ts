import {Component} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AgeValidator} from "./age-validator";
import {UsernameValidator} from "./username-validator";
import {Http} from "@angular/http";
import {SERVER_URL} from "../../config";
import {ToastController} from "ionic-angular";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public registrationForm: FormGroup;
  public readonly minAge: number = 18;
  private readonly emailRegex = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";

  constructor(private readonly formBuilder: FormBuilder, private readonly usernameValidator: UsernameValidator,
              private readonly http: Http, private readonly toastCtrl: ToastController) {

    this.registrationForm = formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
        , usernameValidator.validate.bind(usernameValidator)],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      age: ['', [Validators.required, AgeValidator.validate(this.minAge)]]
    });

    // example without the FormBuilder
    /*
     this.registrationForm = new FormGroup({
     username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
     usernameValidator.validate.bind(usernameValidator)),
     email: new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)]),
     age: new FormControl('', [Validators.required, AgeValidator.validate(this.minAge)])
     });
     */

    // testing server side validation
    /*
     this.registrationForm = formBuilder.group({
     username: [],
     email: [],
     age: []
     });
     */
  }

  hasError(field: string, error: string) {
    const ctrl = this.registrationForm.get(field);
    return ctrl.dirty && ctrl.hasError(error);
  }

  isInvalidAndDirty(field: string) {
    const ctrl = this.registrationForm.get(field);
    return !ctrl.valid && ctrl.dirty;
  }

  register() {
    console.log(this.registrationForm.value);
    this.http.post(`${SERVER_URL}/register`, this.registrationForm.value)
      .map(response => response.json())
      .subscribe(data => {
        for (let fieldName in data) {
          const serverErrors = data[fieldName];

          const errors = {};
          for (let serverError of serverErrors) {
            errors[serverError] = true;
          }

          const control = this.registrationForm.get(fieldName);
          control.setErrors(errors);
          control.markAsDirty();
        }

        if (this.registrationForm.valid) {
          let toast = this.toastCtrl.create({
            message: 'Registration successful',
            duration: 3000
          });
          toast.present();
        }

      });

  }

}
