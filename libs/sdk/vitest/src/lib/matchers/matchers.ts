import type { SkyToBeAccessibleOptions } from './to-be-accessible-options.js';
import type { SkyToBeVisibleOptions } from './to-be-visible-options.js';

/**
 * The custom matchers added to Vitest's `expect` by `@skyux-sdk/vitest`.
 */
export interface SkyVitestMatchers {
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
   * Asserts that the received text equals the text for the expected
   * library resource string.
   * @param resourceKey The resource key to look up.
   * @param resourceArgs Optional replacement arguments for the resource string.
   */
  toEqualLibResourceText: (
    resourceKey: string,
    resourceArgs?: unknown[],
  ) => Promise<void>;

  /**
   * Asserts that the received text equals the text for the expected
   * app resource string.
   * @param resourceKey The resource key to look up.
   * @param resourceArgs Optional replacement arguments for the resource string.
   */
  toEqualResourceText: (
    resourceKey: string,
    resourceArgs?: unknown[],
  ) => Promise<void>;

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
   * Asserts that the received element's text matches the text for the
   * expected library resource string.
   * @param resourceKey The resource key to look up.
   * @param resourceArgs Optional replacement arguments for the resource string.
   * @param trimWhitespace Whether to trim whitespace from the element
   * text before comparison. Defaults to `true`.
   */
  toHaveLibResourceText: (
    resourceKey: string,
    resourceArgs?: unknown[],
    trimWhitespace?: boolean,
  ) => Promise<void>;

  /**
   * Asserts that the received element's text matches the text for the
   * expected app resource string.
   * @param resourceKey The resource key to look up.
   * @param resourceArgs Optional replacement arguments for the resource string.
   * @param trimWhitespace Whether to trim whitespace from the element
   * text before comparison. Defaults to `true`.
   */
  toHaveResourceText: (
    resourceKey: string,
    resourceArgs?: unknown[],
    trimWhitespace?: boolean,
  ) => Promise<void>;

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

  /**
   * Asserts that the received element's text matches the expected
   * library resource template pattern (ignoring interpolated values).
   * @param resourceKey The resource key to look up.
   */
  toMatchLibResourceTemplate: (resourceKey: string) => Promise<void>;

  /**
   * Asserts that the received element's text matches the expected
   * app resource template pattern (ignoring interpolated values).
   * @param resourceKey The resource key to look up.
   */
  toMatchResourceTemplate: (resourceKey: string) => Promise<void>;
}
