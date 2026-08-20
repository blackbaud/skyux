import { expect } from 'vitest';
import type { ExpectationResult } from './types/expectation-result';
import { hasText } from './utility/has-text';

expect.extend({
  toHaveText(
    el: Element,
    expectedText: string,
    trimWhitespace = true,
  ): ExpectationResult {
    const { pass, message } = hasText(el, expectedText, trimWhitespace);

    return { pass, message: () => message };
  },
});

export {};
