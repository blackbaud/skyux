import {
  ChangeDetectorRef,
  Directive,
  HostBinding,
  Input,
  OnInit,
  inject,
} from '@angular/core';

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
  @Input()
  public labelText: string | null | undefined;

  @HostBinding('style.display')
  public display: 'none' | undefined;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #labelTextRequiredSvc = inject(
    SkyFormFieldLabelTextRequiredService,
    {
      optional: true,
    },
  );

  public ngOnInit(): void {
    if (this.#labelTextRequiredSvc) {
      if (this.labelText === undefined) {
        this.display = 'none';
        this.#changeDetector.markForCheck();
      }

      this.#labelTextRequiredSvc.validateLabelText(this.labelText);
    }
  }
}
