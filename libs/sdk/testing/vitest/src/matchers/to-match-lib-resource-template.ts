// eslint-disable-next-line @nx/enforce-module-boundaries
import { _skyTestingCheckLibResourceTemplate } from '@skyux-sdk/testing/private';
import { expect } from 'vitest';
import type { ExpectationResult } from '../types/expectation-result';

expect.extend({
  async toMatchLibResourceTemplate(
    el: Element | null | undefined,
    resourceKey: string,
  ): Promise<ExpectationResult> {
    if (!el) {
      throw new Error('toMatchLibResourceTemplate expects an Element.');
    }

    const { pass, message } = await _skyTestingCheckLibResourceTemplate(
      el,
      resourceKey,
    );

    return { pass, message: () => message };
  },
});

export {};
