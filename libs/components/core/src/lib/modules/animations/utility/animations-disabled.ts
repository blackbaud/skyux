import { DOCUMENT, inject } from '@angular/core';

import { SKY_ANIMATIONS_DISABLED_CLASS_NAME } from './constants';

/**
 * @internal
 */
export function _skyAnimationsDisabled(): boolean {
  return inject(DOCUMENT).body.classList.contains(
    SKY_ANIMATIONS_DISABLED_CLASS_NAME,
  );
}
