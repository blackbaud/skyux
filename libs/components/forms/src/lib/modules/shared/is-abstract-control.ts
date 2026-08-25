import { AbstractControl } from '@angular/forms';

// Components that call mutation methods (`setValue`, `markAsDirty`, `markAsTouched`,
// `setErrors`, etc.) on a control captured from `validate()` or an injected `NgControl`
// should guard those calls with this function, since the read-only interop control that
// signal forms' `[formField]` directive provides through `NgControl` has no such methods.
/**
 * Reports whether `control` is a real `AbstractControl`.
 * @internal
 */
export function skyIsAbstractControl(
  control: AbstractControl | null | undefined,
): control is AbstractControl {
  return control instanceof AbstractControl;
}
