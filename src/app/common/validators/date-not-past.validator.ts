import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateNotPastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate < today ? { dateInPast: true } : null;
  };
}
