import { Injector } from '@angular/core';
import {
  AbstractControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  NgModel,
  Validators,
} from '@angular/forms';

// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
/**
 * @internal
 */
export class SkyFormsUtility {
  /** Coerces a data-bound value (typically a string) to a boolean. */
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
   */
  public static hasRequiredValidation(
    control?: NgControl | AbstractControl | null,
    injector?: Injector,
  ): boolean {
    if (!control) {
      return false;
    }

    if (!injector && control instanceof NgControl) {
      throw new Error('Injector must be specified when an NgControl is given');
    }

    const abstractControl =
      control instanceof NgControl
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          SkyFormsUtility.getAbstractControl(control, injector!)
        : control;
    return !!abstractControl?.hasValidator(Validators.required);
  }
}
