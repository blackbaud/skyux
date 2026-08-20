import { expect } from 'vitest';
import type { SkyToBeAccessibleOptions } from './to-be-accessible-options';
import type { ExpectationResult } from './types/expectation-result';
import { checkAccessibility } from './utility/check-accessibility';

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
