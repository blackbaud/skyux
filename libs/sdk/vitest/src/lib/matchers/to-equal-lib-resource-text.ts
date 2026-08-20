import { expect } from 'vitest';
import { checkLibResourceText } from '../utility/check-lib-resource-text';
import type { ExpectationResult } from './expectation-result';

expect.extend({
  async toEqualLibResourceText(
    actualText: string,
    resourceKey: string,
    resourceArgs?: unknown[],
  ): Promise<ExpectationResult> {
    const { pass, message } = await checkLibResourceText(
      actualText,
      resourceKey,
      resourceArgs,
    );

    return { pass, message: () => message };
  },
});

export {};
