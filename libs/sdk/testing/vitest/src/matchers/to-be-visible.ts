// eslint-disable-next-line @nx/enforce-module-boundaries
import { _skyTestingCheckVisibility } from '@skyux-sdk/testing/private';

import { expect } from 'vitest';

import type { ExpectationResult } from '../types/expectation-result';
import { SkyToBeVisibleOptions } from './to-be-visible-options';

expect.extend({
  toBeVisible(
    received: Element,
    options?: SkyToBeVisibleOptions,
  ): ExpectationResult {
    const pass = _skyTestingCheckVisibility(received, options);

    return {
      pass,
      message: () =>
        pass
          ? 'Expected element to not be visible'
          : 'Expected element to be visible',
    };
  },
});

export {};
