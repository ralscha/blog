import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {UsernameValidator} from '../username-validator';
import {ToastController} from '@ionic/angular';
import {AgeValidator} from '../age-validator';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  public registrationForm: FormGroup;
  public readonly minAge: number = 18;
  private readonly emailRegex = `(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])`;

  constructor(formBuilder: FormBuilder, usernameValidator: UsernameValidator,
              private readonly http: HttpClient, private readonly toastCtrl: ToastController) {

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
    this.http.post<object>(`${environment.serverURL}/register`, this.registrationForm.value)
      .subscribe(async (data) => {
        for (const fieldName of Object.keys(data)) {
          const serverErrors = data[fieldName];

          const errors = {};
          for (const serverError of serverErrors) {
            errors[serverError] = true;
          }

          const control = this.registrationForm.get(fieldName);
          control.setErrors(errors);
          control.markAsDirty();
        }

        if (this.registrationForm.valid) {
          const toast = await this.toastCtrl.create({
            message: 'Registration successful',
            duration: 3000
          });
          toast.present();
        }
      });
  }
}
