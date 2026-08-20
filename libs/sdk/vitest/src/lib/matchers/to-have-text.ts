import { expect } from 'vitest';
import type { ExpectationResult } from './expectation-result';

expect.extend({
  toHaveText(
    el: Element,
    expectedText: string,
    trimWhitespace = true,
  ): ExpectationResult {
    const { pass, message } = _skyTestingHasText(
      el,
      expectedText,
      trimWhitespace,
    );

    return { pass, message: () => message };
  },
});

export {};
