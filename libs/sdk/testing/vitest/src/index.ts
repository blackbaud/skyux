import { SkyA11yAnalyzer } from '@skyux-sdk/testing/private';
import type { SkyA11yAnalyzerConfig } from '@skyux-sdk/testing/private';

import { expect } from 'vitest';

interface ExpectationResult {
  pass: boolean;
  message: () => string;
}

interface CustomMatchers {
  /**
   * Asserts that the received element or document passes automated
   * accessibility checks using axe-core.
   * @param config Optional configuration to enable or disable specific
   * axe-core rules.
   */
  toBeAccessible: (config?: SkyA11yAnalyzerConfig) => Promise<void>;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
  interface Matchers extends CustomMatchers {}
}

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
