import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  EnvironmentProviders,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';

import { SKY_ANIMATIONS_DISABLED_CLASS_NAME } from './constants';

/**
 * Disables CSS transitions and animations for SKY UX components.
 *
 * Use this in unit tests or in applications that need to suppress
 * motion globally.
 *
 * @example
 * ```typescript
 * TestBed.configureTestingModule({
 *   imports: [MyComponent],
 *   providers: [provideNoopSkyAnimations()],
 * });
 * ```
 */
export function provideNoopSkyAnimations(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const doc = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    if (!doc.body.classList.contains(SKY_ANIMATIONS_DISABLED_CLASS_NAME)) {
      doc.body.classList.add(SKY_ANIMATIONS_DISABLED_CLASS_NAME);

      destroyRef.onDestroy(() => {
        doc.body.classList.remove(SKY_ANIMATIONS_DISABLED_CLASS_NAME);
      });
    }
  });
}
