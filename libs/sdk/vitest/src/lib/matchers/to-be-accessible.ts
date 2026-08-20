import { expect } from 'vitest';
import { checkAccessibility } from '../utility/check-accessibility';
import type { ExpectationResult } from './expectation-result';
import type { SkyToBeAccessibleOptions } from './to-be-accessible-options';

expect.extend({
  async toBeAccessible(
    el: Element | Document,
    options?: SkyToBeAccessibleOptions,
  ): Promise<ExpectationResult> {
    const { pass, message } = await checkAccessibility(el, options);

    return { pass, message: () => message };
  },
});

export {};
