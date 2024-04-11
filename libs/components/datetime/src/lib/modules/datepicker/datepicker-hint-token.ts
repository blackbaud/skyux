import { InjectionToken } from '@angular/core';

/**
 * @internal
 */
export const SKY_DATEPICKER_HINT_CONFIG = new InjectionToken<boolean>(
  'SkyDatepickerHintConfig',
  { factory: () => false },
);
