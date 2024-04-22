import { Injectable } from '@angular/core';

/**
 * Requires child form field components of field groups to use label text.
 * @internal
 */
@Injectable()
export class SkyFieldGroupLabelTextRequiredService {
  public validateLabelText(text: string | undefined): void {
    if (!text) {
      throw new Error(
        'All form fields within <sky-field-group> must have `labelText` set on initialization.',
      );
    }
  }
}
