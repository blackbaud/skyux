import { expect } from 'vitest';
import type { ExpectationResult } from './types/expectation-result';
import { checkExistence } from './utility/check-existence';

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
