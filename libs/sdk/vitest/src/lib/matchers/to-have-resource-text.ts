import { expect } from 'vitest';
import type { ExpectationResult } from './types/expectation-result';
import { hasResourceText } from './utility/has-resource-text';

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

    const { pass, message } = await hasResourceText(
      el,
      resourceKey,
      resourceArgs,
      trimWhitespace,
    );

    return { pass, message: () => message };
  },
});

export {};
