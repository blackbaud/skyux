import { AbstractControl } from '@angular/forms';

/**
 * Reports whether `control` is a real `AbstractControl` rather than the read-only
 * interop control that signal forms' `[formField]` directive provides through `NgControl`.
 * Components that call mutation methods (`setValue`, `markAsDirty`, `markAsTouched`,
 * `setErrors`, etc.) on a control captured from `validate()` or an injected `NgControl`
 * should guard those calls with this function, since the interop control throws when
 * those methods are called on it.
 * @internal
 */
export function skyIsAbstractControl(
  control: AbstractControl | null | undefined,
): control is AbstractControl {
  return typeof control?.markAsTouched === 'function';
}
