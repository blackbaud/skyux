// Forces TypeScript to resolve vitest so the module augmentation below is valid.
import type {} from 'vitest';

import './matchers/to-be-accessible';

import type { SkyToBeAccessibleOptions } from './matchers/to-be-accessible-options';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  interface Assertion<T = any> {
    /**
     * Asserts that the received element or document passes automated
     * accessibility checks using axe-core.
     * @param config Optional configuration to enable or disable specific
     * axe-core rules.
     */
    toBeAccessible: (config?: SkyToBeAccessibleOptions) => Promise<void>;
  }
}

export type { SkyToBeAccessibleOptions } from './matchers/to-be-accessible-options';
