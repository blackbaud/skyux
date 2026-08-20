import { expect } from 'vitest';
import type { ExpectationResult } from './types/expectation-result';
import { checkResourceText } from './utility/check-resource-text';

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
