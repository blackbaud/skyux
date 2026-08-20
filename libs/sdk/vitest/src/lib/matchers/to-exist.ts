import { expect } from 'vitest';
import { checkExistence } from '../utility/check-existence';
import type { ExpectationResult } from './expectation-result';

expect.extend({
  toExist(el: Element | null | undefined): ExpectationResult {
    const { pass, message } = checkExistence(el);

    return {
      pass,
      message: () => message,
    };
  },
});

export {};
