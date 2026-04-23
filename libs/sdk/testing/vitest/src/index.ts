// Forces TypeScript to resolve vitest so the module augmentation below is valid.
import type {} from 'vitest';

import './matchers/to-be-accessible';
import './matchers/to-be-visible';
import './matchers/to-exist';
import './matchers/to-have-css-class';
import './matchers/to-have-style';
import './matchers/to-have-text';

import type { SkyToBeAccessibleOptions } from './matchers/to-be-accessible-options';
import type { SkyToBeVisibleOptions } from './matchers/to-be-visible-options';

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

    /**
     * Asserts that the received element is visible.
     * @param options Optional configuration to control which visibility
     * checks are performed.
     */
    toBeVisible: (config?: SkyToBeVisibleOptions) => void;

    /**
     * Asserts that the received value is truthy (exists).
     */
    toExist: () => void;

    /**
     * Asserts that the received element has the expected CSS class.
     * @param expectedClassName The CSS class name to check for.
     */
    toHaveCssClass: (expectedClassName: string) => void;

    /**
     * Asserts that the received element has the expected computed style(s).
     * @param expectedStyles An object representing the style(s) to check for.
     */
    toHaveStyle: (expectedStyles: Record<string, string>) => void;

    /**
     * Asserts that the received element has the expected text content.
     * @param expectedText The text to check for in the element.
     * @param trimWhitespace Whether to trim whitespace from the element
     * text before comparison. Defaults to `true`.
     */
    toHaveText: (expectedText: string, trimWhitespace?: boolean) => void;
  }
}

export type { SkyToBeAccessibleOptions } from './matchers/to-be-accessible-options';
export type { SkyToBeVisibleOptions } from './matchers/to-be-visible-options';
