import { expect } from 'vitest';
import type { SkyToBeVisibleOptions } from './to-be-visible-options';
import type { ExpectationResult } from './types/expectation-result';
import { checkVisibility } from './utility/check-visibility';

expect.extend({
  toBeVisible(el: Element, options?: SkyToBeVisibleOptions): ExpectationResult {
    const { pass, message } = checkVisibility(el, options);

    return {
      pass,
      message: () => message,
    };
  },
});

export {};
