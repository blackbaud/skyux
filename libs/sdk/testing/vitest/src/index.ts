// eslint-disable-next-line @nx/enforce-module-boundaries
import { type SkyA11yAnalyzerConfig } from '@skyux-sdk/testing/private';

import './a11y.matcher';

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

export {};
