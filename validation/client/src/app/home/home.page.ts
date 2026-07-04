import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  FormRoot,
  maxLength,
  min,
  minLength,
  required,
  submit,
  validateHttp,
} from '@angular/forms/signals';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface Registration {
  username: string;
  email: string;
  age: number | null;
}

type ServerValidationErrors = Partial<Record<keyof Registration, string[]>>;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [
    FormField,
    FormRoot,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonSpinner,
  ],
})
export class HomePage {
  public readonly minAge = 18;

  private readonly http = inject(HttpClient);
  private readonly toastCtrl = inject(ToastController);

  public readonly registration = signal<Registration>({
    username: '',
    email: '',
    age: null,
  });

  public readonly registrationForm = form(this.registration, (path) => {
    required(path.username);
    minLength(path.username, 2);
    maxLength(path.username, 30);

    validateHttp(path.username, {
      request: ({ value }) => {
        const username = value().trim();
        return username.length >= 2
          ? `${environment.serverURL}/checkUsername?value=${encodeURIComponent(username)}`
          : undefined;
      },
      debounce: 250,
      onSuccess: (taken: boolean) =>
        taken ? { kind: 'usernameTaken', message: 'Username is already taken' } : undefined,
      onError: () => ({
        kind: 'usernameCheckFailed',
        message: 'Could not check the username',
      }),
    });

    required(path.email);
    email(path.email);

    required(path.age);
    min(path.age, this.minAge, {
      error: {
        kind: 'notOldEnough',
        message: `You must be at least ${this.minAge} years old`,
      },
    });
  });

  public readonly canSubmit = computed(
    () =>
      this.registrationForm().valid() &&
      !this.registrationForm().pending() &&
      !this.registrationForm().submitting(),
  );

  public showErrors(
    field: () => { dirty: () => boolean; touched: () => boolean; invalid: () => boolean },
  ): boolean {
    const state = field();
    return state.invalid() && (state.dirty() || state.touched());
  }

  public hasError(field: () => { getError: (kind: string) => unknown }, kind: string): boolean {
    return field().getError(kind) !== undefined;
  }

  public async register(): Promise<void> {
    const success = await submit(this.registrationForm, async (formTree) => {
      const errors = await firstValueFrom(
        this.http.post<ServerValidationErrors>(
          `${environment.serverURL}/register`,
          formTree().value(),
        ),
      );

      const validationErrors = Object.entries(errors).flatMap(
        ([fieldName, fieldErrors]) =>
          fieldErrors?.map((kind) => ({
            fieldTree: formTree[fieldName as keyof Registration],
            kind,
            message: this.messageFor(kind),
          })) ?? [],
      );

      return validationErrors.length > 0 ? validationErrors : undefined;
    });

    if (success) {
      const toast = await this.toastCtrl.create({
        message: 'Registration successful',
        duration: 3000,
      });
      await toast.present();
    }
  }

  private messageFor(kind: string): string {
    switch (kind) {
      case 'required':
        return 'This field is required';
      case 'minLength':
        return 'The value is too short';
      case 'maxLength':
        return 'The value is too long';
      case 'email':
        return 'Email is not valid';
      case 'notOldEnough':
        return `You must be at least ${this.minAge} years old`;
      case 'usernameTaken':
        return 'Username is already taken';
      default:
        return 'The value is invalid';
    }
  }
}
