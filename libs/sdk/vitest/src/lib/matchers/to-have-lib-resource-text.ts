import { expect } from 'vitest';
import { hasLibResourceText } from '../utility/has-lib-resource-text';
import type { ExpectationResult } from './expectation-result';

expect.extend({
  async toHaveLibResourceText(
    el: Element | null | undefined,
    resourceKey: string,
    resourceArgs?: unknown[],
    trimWhitespace = true,
  ): Promise<ExpectationResult> {
    if (!el) {
      throw new Error('toHaveLibResourceText expects an Element.');
    }

    const { pass, message } = await hasLibResourceText(
      el,
      resourceKey,
      resourceArgs,
      trimWhitespace,
    );

    return { pass, message: () => message };
  },
});

export {};
