// eslint-disable-next-line @nx/enforce-module-boundaries
import { _skyTestingHasResourceText } from '@skyux-sdk/testing/private';
import { expect } from 'vitest';
import type { ExpectationResult } from '../types/expectation-result';

expect.extend({
  async toHaveResourceText(
    el: Element | null | undefined,
    resourceKey: string,
    resourceArgs?: unknown[],
    trimWhitespace = true,
  ): Promise<ExpectationResult> {
    if (!el) {
      throw new Error('toHaveResourceText expects an Element.');
    }

    const { pass, message } = await _skyTestingHasResourceText(
      el,
      resourceKey,
      resourceArgs,
      trimWhitespace,
    );

    return { pass, message: () => message };
  },
});

export {};
