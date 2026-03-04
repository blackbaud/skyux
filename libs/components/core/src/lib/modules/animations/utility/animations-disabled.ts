import { DOCUMENT, inject } from '@angular/core';

import { SKY_DISABLED_ANIMATIONS_CLASS_NAME } from './constants';

/**
 * @internal
 */
export function _skyAnimationsDisabled(): boolean {
  return inject(DOCUMENT).body.classList.contains(
    SKY_DISABLED_ANIMATIONS_CLASS_NAME,
  );
}
