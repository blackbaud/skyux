import { DOCUMENT } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';

const STYLE_ID = 'sky-noop-animations';

/**
 * Provides a mechanism to disable CSS transitions and animations during tests.
 * Add this to the `providers` array in `TestBed.configureTestingModule()` to
 * prevent CSS `transition` and `animation` properties from running.
 *
 * This is analogous to Angular's `provideNoopAnimations()`, but targets
 * CSS-based animations instead of Angular's `@angular/animations` system.
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

    if (!doc.getElementById(STYLE_ID)) {
      const style = doc.createElement('style');

      style.id = STYLE_ID;
      style.textContent =
        '*, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }';

      doc.head.appendChild(style);
    }
  });
}
