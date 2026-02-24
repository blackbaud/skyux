import { DOCUMENT } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';

const STYLE_ID = 'sky-noop-animations';

/**
 * Disables CSS transitions and animations by injecting a global `<style>`
 * element that sets near-zero durations. Transition and animation events
 * (e.g. `transitionend`) still fire, so application logic that depends
 * on them continues to work.
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

    if (!doc.getElementById(STYLE_ID)) {
      const style = doc.createElement('style');

      style.id = STYLE_ID;
      style.textContent =
        ':root { --sky-animation-duration-noop: 0.01ms; } *, *::before, *::after { transition-duration: var(--sky-animation-duration-noop) !important; animation-duration: var(--sky-animation-duration-noop) !important; animation-iteration-count: 1 !important; }';

      doc.head.appendChild(style);
    }
  });
}
