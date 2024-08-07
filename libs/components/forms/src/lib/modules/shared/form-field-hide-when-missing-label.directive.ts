import { Directive, HostBinding, Input, OnInit, inject } from '@angular/core';

import { SkyFormFieldLabelTextRequiredService } from './form-field-label-text-required.service';

/**
 * Hide form field components of field groups that are missing label text.
 * @internal
 */
@Directive({
  selector: '[skyFormFieldHideWhenMissingLabel]',
  standalone: true,
})
export class SkyFormFieldHideWhenMissingLabelDirective implements OnInit {
  readonly #labelTextRequired = inject(SkyFormFieldLabelTextRequiredService, {
    optional: true,
  });

  @HostBinding('style.display')
  public display: 'none' | undefined = undefined;

  @Input()
  public set labelText(value: string | null | undefined) {
    this.#labelText = value;
    if (this.#labelTextRequired) {
      this.display = value ? undefined : 'none';
    }
  }

  #labelText: string | null | undefined;

  public ngOnInit(): void {
    this.#labelTextRequired?.validateLabelText(this.#labelText);
  }
}
