import { expect } from 'vitest';

import type { ExpectationResult } from '../types/expectation-result';

import type { SkyToBeVisibleOptions } from './to-be-visible-options';

expect.extend({
  toBeVisible(
    received: Element,
    options?: SkyToBeVisibleOptions,
  ): ExpectationResult {
    const defaults: SkyToBeVisibleOptions = {
      checkCssDisplay: true,
      checkCssVisibility: false,
      checkDimensions: false,
      checkExists: false,
    };

    const settings = { ...defaults, ...options };

    let pass = true;

    if (settings.checkExists) {
      pass = !!received;
    }

    if (pass) {
      const computedStyle = window.getComputedStyle(received);

      if (settings.checkCssDisplay) {
        pass = computedStyle.display !== 'none';
      }

      if (settings.checkCssVisibility) {
        pass = computedStyle.visibility !== 'hidden';
      }

      if (settings.checkDimensions) {
        const box = received.getBoundingClientRect();
        pass = box.width > 0 && box.height > 0;
      }
    }

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
