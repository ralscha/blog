import {AbstractControl} from '@angular/forms';

export class AgeValidator {

  static validate(minAge: number) {
    return (control: AbstractControl): { [key: string]: boolean } => {
      if (!control.value || 0 === control.value.length) {
        return null;
      }

      if (control.value >= minAge) {
        return null;
      }
      return {'notOldEnough': true};
    };
  }

}
