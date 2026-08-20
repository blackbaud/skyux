import { expect } from 'vitest';
import type { ExpectationResult } from './types/expectation-result';
import { hasStyle } from './utility/has-style';

expect.extend({
  toHaveStyle(
    el: Element,
    expectedStyles: Record<string, string>,
  ): ExpectationResult {
    const { pass, message } = hasStyle(el, expectedStyles);

    return {
      pass,
      message: () => message,
    };
  },
});

export {};
