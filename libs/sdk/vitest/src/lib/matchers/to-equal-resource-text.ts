import { expect } from 'vitest';
import { checkResourceText } from '../utility/check-resource-text';
import type { ExpectationResult } from './expectation-result';

expect.extend({
  async toEqualResourceText(
    actualText: string,
    resourceKey: string,
    resourceArgs?: unknown[],
  ): Promise<ExpectationResult> {
    const { pass, message } = await checkResourceText(
      actualText,
      resourceKey,
      resourceArgs,
    );

    return { pass, message: () => message };
  },
});

export {};
