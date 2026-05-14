// eslint-disable-next-line @nx/enforce-module-boundaries
import { _skyTestingCheckResourceText } from '@skyux-sdk/testing/private';
import { expect } from 'vitest';
import type { ExpectationResult } from '../types/expectation-result';

expect.extend({
  async toEqualResourceText(
    actualText: string,
    resourceKey: string,
    resourceArgs?: unknown[],
  ): Promise<ExpectationResult> {
    const { pass, message } = await _skyTestingCheckResourceText(
      actualText,
      resourceKey,
      resourceArgs,
    );

    return { pass, message: () => message };
  },
});

export {};
