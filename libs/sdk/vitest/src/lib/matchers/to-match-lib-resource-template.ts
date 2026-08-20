import { expect } from 'vitest';
import type { ExpectationResult } from './types/expectation-result';
import { checkLibResourceTemplate } from './utility/check-lib-resource-template';

expect.extend({
  async toMatchLibResourceTemplate(
    el: Element | null | undefined,
    resourceKey: string,
  ): Promise<ExpectationResult> {
    if (!el) {
      throw new Error('toMatchLibResourceTemplate expects an Element.');
    }

    const { pass, message } = await checkLibResourceTemplate(el, resourceKey);

    return { pass, message: () => message };
  },
});

export {};
