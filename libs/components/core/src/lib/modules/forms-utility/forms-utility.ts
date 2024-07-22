import { AbstractControl, NgControl } from '@angular/forms';

/**
 * @deprecated
 * @internal
 */
export class SkyFormsUtility {
  /**
   * Gets the required state of the checkbox.
   * Currently, Angular doesn't offer a way to get this easily, so we have to create an empty
   * control using the current validator to see if it throws a `required` validation error.
   * https://github.com/angular/angular/issues/13461#issuecomment-340368046
   * @deprecated Use the host directive `SkyRequiredStateDirective` instead.
   */
  public static hasRequiredValidation(ngControl: NgControl): boolean {
    const abstractControl = ngControl.control as AbstractControl;
    if (abstractControl && abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      if (validator && validator['required']) {
        return true;
      }
    }
    return false;
  }
}
