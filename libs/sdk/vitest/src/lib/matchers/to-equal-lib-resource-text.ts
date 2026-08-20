import { expect } from 'vitest';
import type { ExpectationResult } from './types/expectation-result';
import { checkLibResourceText } from './utility/check-lib-resource-text';

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
