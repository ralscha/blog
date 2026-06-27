import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SignalFormControl } from '@angular/forms/signals/compat';
import { maxLength, minLength, pattern, required, validate } from '@angular/forms/signals';
import { HttpClient } from '@angular/common/http';
import { UsernameValidator } from '../username-validator';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
  ],
})
export class HomePage {
  public registrationForm: FormGroup<{
    username: SignalFormControl<string>;
    email: SignalFormControl<string>;
    age: SignalFormControl<string>;
  }>;
  public readonly minAge: number = 18;
  private readonly http = inject(HttpClient);
  private readonly toastCtrl = inject(ToastController);
  private readonly emailRegex = `(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])`;

  constructor() {
    const usernameValidator = inject(UsernameValidator);

    const username = new SignalFormControl('', (path) => {
      required(path);
      minLength(path, 2);
      maxLength(path, 30);
    });
    username.setAsyncValidators(usernameValidator.validate.bind(usernameValidator));

    this.registrationForm = new FormGroup({
      username,
      email: new SignalFormControl('', (path) => {
        required(path);
        pattern(path, new RegExp(this.emailRegex));
      }),
      age: new SignalFormControl('', (path) => {
        required(path);
        validate(path, (ctx) => {
          const value = ctx.value();
          return value && Number(value) < this.minAge ? { kind: 'notOldEnough' } : undefined;
        });
      }),
    });

    // testing server side validation
    /*
     this.registrationForm = formBuilder.group({
     username: [],
     email: [],
     age: []
     });
     */
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.registrationForm.get(field);
    return ctrl !== null && ctrl.dirty && ctrl.hasError(error);
  }

  isInvalidAndDirty(field: string): boolean {
    const ctrl = this.registrationForm.get(field);
    return ctrl !== null && !ctrl.valid && ctrl.dirty;
  }

  register(): void {
    console.log(this.registrationForm.value);
    this.http
      .post<{
        [key: string]: string[];
      }>(`${environment.serverURL}/register`, this.registrationForm.value)
      .subscribe(async (data) => {
        for (const fieldName of Object.keys(data)) {
          const serverErrors = data[fieldName];

          const errors: { [key: string]: boolean } = {};
          for (const serverError of serverErrors) {
            errors[serverError] = true;
          }

          const control = this.registrationForm.get(fieldName);
          if (control !== null) {
            control.setErrors(errors);
            control.markAsDirty();
          }
        }

        if (this.registrationForm.valid) {
          const toast = await this.toastCtrl.create({
            message: 'Registration successful',
            duration: 3000,
          });
          await toast.present();
        }
      });
  }
}
