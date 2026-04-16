// eslint-disable-next-line @nx/enforce-module-boundaries
import { type SkyA11yAnalyzerConfig } from '@skyux-sdk/testing/private';
// Forces TypeScript to resolve @vitest/expect so the module augmentation below is valid.
import type {} from '@vitest/expect';

import './matchers/to-be-accessible';

declare module '@vitest/expect' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  interface Assertion<T = any> {
    /**
     * Asserts that the received element or document passes automated
     * accessibility checks using axe-core.
     * @param config Optional configuration to enable or disable specific
     * axe-core rules.
     */
    toBeAccessible: (config?: SkyA11yAnalyzerConfig) => Promise<void>;
  }
}

export {};
