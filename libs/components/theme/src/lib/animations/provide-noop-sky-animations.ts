import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  EnvironmentProviders,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';

const CLASS_NAME = 'sky-theme-animations-disabled';

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

    if (!doc.body.classList.contains(CLASS_NAME)) {
      doc.body.classList.add(CLASS_NAME);

      destroyRef.onDestroy(() => {
        doc.body.classList.remove(CLASS_NAME);
      });
    }
  });
}
