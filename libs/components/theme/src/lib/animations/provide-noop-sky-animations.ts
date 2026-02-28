import { DOCUMENT } from '@angular/common';
import {
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

    doc.body.classList.add('sky-theme-animations-disabled');
  });
}
