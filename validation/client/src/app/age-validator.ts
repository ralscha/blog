import {AbstractControl} from '@angular/forms';

export class AgeValidator {

  static validate(minAge: number): (control: AbstractControl) => { [key: string]: boolean } | null {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value || 0 === control.value.length) {
        return null;
      }

      if (control.value >= minAge) {
        return null;
      }
      return {notOldEnough: true};
    };
  }

}
