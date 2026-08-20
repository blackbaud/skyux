import { expect } from 'vitest';
import { checkResourceTemplate } from '../utility/check-resource-template';
import type { ExpectationResult } from './expectation-result';

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
