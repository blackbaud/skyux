import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  EnvironmentProviders,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';

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

    doc.body.classList.add('sky-theme-animations-disabled');

    destroyRef.onDestroy(() => {
      doc.body.classList.remove('sky-theme-animations-disabled');
    });
  });
}
