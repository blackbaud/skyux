// eslint-disable-next-line @nx/enforce-module-boundaries
import { _skyTestingCheckResourceTemplate } from '@skyux-sdk/testing/private';
import { expect } from 'vitest';
import type { ExpectationResult } from '../types/expectation-result';

expect.extend({
  async toMatchResourceTemplate(
    el: Element | null | undefined,
    resourceKey: string,
  ): Promise<ExpectationResult> {
    if (!el) {
      throw new Error('toMatchResourceTemplate expects an Element.');
    }

    const { pass, message } = await _skyTestingCheckResourceTemplate(
      el,
      resourceKey,
    );

    return { pass, message: () => message };
  },
});

export {};
