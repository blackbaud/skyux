import { Injectable, inject } from '@angular/core';
import { SkyLogService } from '@skyux/core';

/**
 * Requires child form field components of field groups to use label text.
 * @internal
 */
@Injectable()
export class SkyFormFieldLabelTextRequiredService {
  readonly #loggerService = inject(SkyLogService);

  public validateLabelText(text: string | null | undefined): void {
    if (typeof text === 'undefined') {
      this.#loggerService.error(
        'All form fields within <sky-field-group> must have `labelText` set on initialization.',
      );
    }
  }
}
