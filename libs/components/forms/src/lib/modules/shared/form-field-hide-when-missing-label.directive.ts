import { Directive, HostBinding, Input, inject } from '@angular/core';

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
  public display: 'none' | undefined = undefined;

  @Input()
  public set labelText(value: string | null | undefined) {
    if (this.#labelTextRequired) {
      this.display = value ? undefined : 'none';
    }
  }
}
