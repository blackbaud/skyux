import { Directive, HostBinding, effect, inject, input } from '@angular/core';

import { SkyFormFieldLabelTextRequiredService } from './form-field-label-text-required.service';

/**
 * Hide form field components of field groups that are missing label text.
 * @internal
 */
@Directive({
  selector: '[skyFormFieldHideWhenMissingLabel]',
  standalone: true,
})
export class SkyFormFieldHideWhenMissingLabelDirective {
  readonly #labelTextRequired = inject(SkyFormFieldLabelTextRequiredService, {
    optional: true,
  });

  @HostBinding('style.display')
  public display: undefined | 'none' = undefined;

  public readonly labelText = input<string | null | undefined>();

  constructor() {
    effect(() => {
      if (this.#labelTextRequired) {
        this.display = this.labelText() ? undefined : 'none';
      }
    });
  }
}
