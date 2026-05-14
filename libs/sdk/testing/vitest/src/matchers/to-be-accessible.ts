// eslint-disable-next-line @nx/enforce-module-boundaries
import { _skyTestingCheckAccessibility } from '@skyux-sdk/testing/private';
import { expect } from 'vitest';
import type { ExpectationResult } from '../types/expectation-result';
import type { SkyToBeAccessibleOptions } from './to-be-accessible-options';

expect.extend({
  async toBeAccessible(
    el: Element | Document,
    options?: SkyToBeAccessibleOptions,
  ): Promise<ExpectationResult> {
    const { pass, message } = await _skyTestingCheckAccessibility(el, options);

    return { pass, message: () => message };
  },
});

export {};
