import { Directive, Input, booleanAttribute, inject } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

/**
 * A host directive used to capture the "required" state of the host's form control.
 * @internal
 */
@Directive({
  standalone: true,
})
export class SkyRequiredStateDirective {
  @Input({ transform: booleanAttribute })
  public required = false;

  /**
   * Whether the `required` attribute is set to `true`, or the control includes
   * the `Validators.required` validator.
   */
  public isRequired(): boolean {
    return (
      this.required ||
      !!this.#ngControl?.control?.hasValidator(Validators.required)
    );
  }

  readonly #ngControl = inject(NgControl, { optional: true, self: true });
}
