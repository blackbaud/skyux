// eslint-disable-next-line @nx/enforce-module-boundaries
import { _skyTestingHasText } from '@skyux-sdk/testing/private';
import { expect } from 'vitest';
import type { ExpectationResult } from '../types/expectation-result';

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
