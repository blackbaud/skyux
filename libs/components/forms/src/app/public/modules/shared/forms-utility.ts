import {
  AbstractControl,
  NgControl
} from '@angular/forms';

// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
export class SkyFormsUtility {

  /** Coerces a data-bound value (typically a string) to a boolean. */
  public static coerceBooleanProperty(value: any): boolean {
    return value !== undefined && `${value}` !== 'false';
  }

  /**
   * Gets the required state of the checkbox.
   * Currently, Angular doesn't offer a way to get this easily, so we have to create an empty
   * control using the current validator to see if it throws a `required` validation error.
   * https://github.com/angular/angular/issues/13461#issuecomment-340368046
   */
  public static hasRequiredValidation(ngControl: NgControl): boolean {
    const abstractControl = ngControl.control as AbstractControl;
    if (abstractControl && abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  }
}
