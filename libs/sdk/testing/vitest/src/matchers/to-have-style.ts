// eslint-disable-next-line @nx/enforce-module-boundaries
import { _skyTestingHasStyle } from '@skyux-sdk/testing/private';
import { expect } from 'vitest';
import type { ExpectationResult } from '../types/expectation-result';

expect.extend({
  toHaveStyle(
    el: Element,
    expectedStyles: Record<string, string>,
  ): ExpectationResult {
    const { pass, message } = _skyTestingHasStyle(el, expectedStyles);

    return {
      pass,
      message: () => message,
    };
  },
});

export {};
