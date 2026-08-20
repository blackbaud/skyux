import { expect } from 'vitest';
import type { ExpectationResult } from './types/expectation-result';
import { checkResourceTemplate } from './utility/check-resource-template';

expect.extend({
  async toMatchResourceTemplate(
    el: Element | null | undefined,
    resourceKey: string,
  ): Promise<ExpectationResult> {
    if (!el) {
      throw new Error('toMatchResourceTemplate expects an Element.');
    }

    const { pass, message } = await checkResourceTemplate(el, resourceKey);

    return { pass, message: () => message };
  },
});

export {};
