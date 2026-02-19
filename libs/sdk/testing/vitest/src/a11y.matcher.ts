// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  SkyA11yAnalyzer,
  type SkyA11yAnalyzerConfig,
} from '@skyux-sdk/testing/private';

import { expect } from 'vitest';

import type { ExpectationResult } from './types/expectation-result';

expect.extend({
  async toBeAccessible(
    received: Element | Document,
    config?: SkyA11yAnalyzerConfig,
  ): Promise<ExpectationResult> {
    const target =
      received instanceof Document ? received.documentElement : received;

    if (!(target instanceof Element)) {
      return {
        pass: false,
        message: () => 'toBeAccessible expects an Element or Document.',
      };
    }

    try {
      await SkyA11yAnalyzer.run(target, config);
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
