import { expect } from 'vitest';
import { hasCssClass } from '../utility/has-css-class';
import type { ExpectationResult } from './expectation-result';

expect.extend({
  toHaveCssClass(el: Element, expectedClassName: string): ExpectationResult {
    const { pass, message } = hasCssClass(el, expectedClassName);

    return { pass, message: () => message };
  },
});

export {};
