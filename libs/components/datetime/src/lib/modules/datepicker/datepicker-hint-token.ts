import { InjectionToken } from '@angular/core';

/**
 * @internal
 */
export const SKY_DATEPICKER_HINT_TEXT_HIDDEN = new InjectionToken<boolean>(
  'SkyDatepickerHintTextHidden',
  { factory: () => false },
);
