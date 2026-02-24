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
 * // In a unit test:
 * TestBed.configureTestingModule({
 *   imports: [MyComponent],
 *   providers: [provideNoopSkyAnimations()],
 * });
 *
 * // In an application:
 * bootstrapApplication(AppComponent, {
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
