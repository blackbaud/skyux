// eslint-disable-next-line @nx/enforce-module-boundaries
import { _skyTestingCheckExistence } from '@skyux-sdk/testing/private';
import { expect } from 'vitest';
import type { ExpectationResult } from '../types/expectation-result';

expect.extend({
  toExist(el: Element | null | undefined): ExpectationResult {
    const { pass, message } = _skyTestingCheckExistence(el);

    return {
      pass,
      message: () => message,
    };
  },
});

export {};
