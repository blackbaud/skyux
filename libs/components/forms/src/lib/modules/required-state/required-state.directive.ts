import { Directive, Input, booleanAttribute, inject } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

/**
 * Applies an input named "required" to a host component.
 * @internal
 */
@Directive({
  standalone: true,
})
export class SkyRequiredStateDirective {
  /**
   * @internal
   */
  @Input({ transform: booleanAttribute })
  public required = false;

  public hasRequiredValidator(): boolean {
    return (
      this.required ||
      !!this.#ngControl?.control?.hasValidator(Validators.required)
    );
  }

  readonly #ngControl = inject(NgControl, { optional: true, self: true });
}
