// eslint-disable-next-line @nx/enforce-module-boundaries
import { _skyTestingHasCssClass } from '@skyux-sdk/testing/private';
import { expect } from 'vitest';
import type { ExpectationResult } from '../types/expectation-result';

expect.extend({
  toHaveCssClass(el: Element, expectedClassName: string): ExpectationResult {
    const { pass, message } = _skyTestingHasCssClass(el, expectedClassName);

    return { pass, message: () => message };
  },
});

export {};
