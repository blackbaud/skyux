import { Injectable } from '@angular/core';

/**
 * Requires child form field components of field groups to use label text.
 * @internal
 */
@Injectable()
export class SkyFormFieldLabelTextRequiredService {
  public validateLabelText(text: string | undefined): void {
    if (!text) {
      console.error(
        'All form fields within <sky-field-group> must have `labelText` set on initialization.',
      );
    }
  }
}
