import { expect } from 'vitest';
import { checkVisibility } from '../utility/check-visibility';
import type { ExpectationResult } from './expectation-result';
import type { SkyToBeVisibleOptions } from './to-be-visible-options';

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
