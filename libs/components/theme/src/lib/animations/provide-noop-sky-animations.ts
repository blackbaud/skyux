import { DOCUMENT } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';

/**
 * Disables CSS transitions and animations by adding the
 * `sky-theme-animations-disabled` class to the document body. This sets
 * `--sky-theme-animations-transition-duration` to `none` for all elements,
 * which suppresses motion globally.
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

    doc.body.classList.add('sky-theme-animations-disabled');
  });
}
