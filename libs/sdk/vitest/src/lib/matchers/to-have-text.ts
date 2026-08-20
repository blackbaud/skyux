import { expect } from 'vitest';
import { hasText } from '../utility/has-text';
import type { ExpectationResult } from './expectation-result';

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
