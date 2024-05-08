import { Injector } from '@angular/core';
import {
  AbstractControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  NgModel,
} from '@angular/forms';

/**
 * @internal
 */
export class SkyFormsUtility {
  /**
   * Coerces a data-bound value (typically a string) to a boolean.
   * @deprecated Use the `booleanAttribute` transform instead.
   */
  public static coerceBooleanProperty(value: any): boolean {
    return value !== undefined && `${value}` !== 'false';
  }

  public static getAbstractControl(
    control: NgControl,
    injector: Injector,
  ): AbstractControl | undefined {
    let abstractControl: AbstractControl | undefined;
    switch (control.constructor) {
      case NgModel:
        abstractControl = (control as NgModel).control;
        break;

      case FormControlName:
        abstractControl = injector
          .get(FormGroupDirective)
          .getControl(control as FormControlName);
        break;

      default:
        abstractControl = (control as FormControlDirective).form;
        break;
    }

    return abstractControl;
  }

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
