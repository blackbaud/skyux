import { inject } from '@angular/core';

import { SKY_ANIMATIONS_DISABLED } from './animations-disabled-token';

/**
 * @internal
 */
export function _skyAnimationsDisabled(): boolean {
  return !!inject(SKY_ANIMATIONS_DISABLED, { optional: true });
}
