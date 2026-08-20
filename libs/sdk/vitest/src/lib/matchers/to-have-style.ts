import { expect } from 'vitest';
import { hasStyle } from '../utility/has-style';
import type { ExpectationResult } from './expectation-result';

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
