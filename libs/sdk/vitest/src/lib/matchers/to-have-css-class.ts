import { expect } from 'vitest';
import type { ExpectationResult } from './types/expectation-result';
import { hasCssClass } from './utility/has-css-class';

expect.extend({
  toHaveCssClass(el: Element, expectedClassName: string): ExpectationResult {
    const { pass, message } = hasCssClass(el, expectedClassName);

    return { pass, message: () => message };
  },
});

export {};
