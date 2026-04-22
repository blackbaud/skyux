import { _SkyA11yAnalyzer } from '@skyux-sdk/testing/private';
import { expect } from 'vitest';
import type { ExpectationResult } from '../types/expectation-result';
import type { SkyToBeAccessibleOptions } from './to-be-accessible-options';

expect.extend({
  async toBeAccessible(
    received: Element | Document,
    options?: SkyToBeAccessibleOptions,
  ): Promise<ExpectationResult> {
    const target =
      received instanceof Document ? received.documentElement : received;

    if (!(target instanceof Element)) {
      throw new Error('toBeAccessible expects an Element or Document.');
    }

    try {
      await _SkyA11yAnalyzer.run(target, options);

      return {
        pass: true,
        message: () =>
          'Expected accessibility violations, but none were found.',
      };
    } catch (err) {
      return {
        pass: false,
        message: () => (err as Error).message,
      };
    }
  },
});

export {};
