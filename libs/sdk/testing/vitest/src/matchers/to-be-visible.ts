// eslint-disable-next-line @nx/enforce-module-boundaries
import { _skyTestingCheckVisibility } from '@skyux-sdk/testing/private';
import { expect } from 'vitest';
import type { ExpectationResult } from '../types/expectation-result';
import { SkyToBeVisibleOptions } from './to-be-visible-options';

expect.extend({
  toBeVisible(el: Element, options?: SkyToBeVisibleOptions): ExpectationResult {
    const { pass, message } = _skyTestingCheckVisibility(el, options);

    return {
      pass,
      message: () => message,
    };
  },
});

export {};
