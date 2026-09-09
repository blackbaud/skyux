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
   * @example
   * ```typescript
   * await expect(fixture.nativeElement).toBeAccessible();
   * ```
   */
  toBeAccessible: (config?: SkyToBeAccessibleOptions) => Promise<void>;

  /**
   * Asserts that the received element is visible.
   * @param options Optional configuration to control which visibility
   * checks are performed.
   * @example
   * ```typescript
   * expect(el).toBeVisible({ checkCssVisibility: true });
   * ```
   */
  toBeVisible: (config?: SkyToBeVisibleOptions) => void;

  /**
   * Asserts that the received text equals the text for the expected
   * library resource string.
   * @param resourceKey The resource key to look up.
   * @param resourceArgs Optional replacement arguments for the resource string.
   * @example
   * ```typescript
   * await expect(el.textContent).toEqualLibResourceText('sky_greeting');
   * ```
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
   * @example
   * ```typescript
   * await expect(el.textContent).toEqualResourceText('greeting', ['World']);
   * ```
   */
  toEqualResourceText: (
    resourceKey: string,
    resourceArgs?: unknown[],
  ) => Promise<void>;

  /**
   * Asserts that the received value is truthy (exists).
   * @example
   * ```typescript
   * expect(el.querySelector('.sky-btn')).toExist();
   * ```
   */
  toExist: () => void;

  /**
   * Asserts that the received element has the expected CSS class.
   * @param expectedClassName The CSS class name to check for.
   * @example
   * ```typescript
   * expect(el).toHaveCssClass('sky-btn-primary');
   * ```
   */
  toHaveCssClass: (expectedClassName: string) => void;

  /**
   * Asserts that the received element's text matches the text for the
   * expected library resource string.
   * @param resourceKey The resource key to look up.
   * @param resourceArgs Optional replacement arguments for the resource string.
   * @param trimWhitespace Whether to trim whitespace from the element
   * text before comparison. Defaults to `true`.
   * @example
   * ```typescript
   * await expect(el).toHaveLibResourceText('sky_greeting');
   * ```
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
   * @example
   * ```typescript
   * await expect(el).toHaveResourceText('greeting', ['World']);
   * ```
   */
  toHaveResourceText: (
    resourceKey: string,
    resourceArgs?: unknown[],
    trimWhitespace?: boolean,
  ) => Promise<void>;

  /**
   * Asserts that the received element has the expected computed style(s).
   * @param expectedStyles An object representing the style(s) to check for.
   * @example
   * ```typescript
   * expect(el).toHaveStyle({ display: 'block' });
   * ```
   */
  toHaveStyle: (expectedStyles: Record<string, string>) => void;

  /**
   * Asserts that the received element has the expected text content.
   * @param expectedText The text to check for in the element.
   * @param trimWhitespace Whether to trim whitespace from the element
   * text before comparison. Defaults to `true`.
   * @example
   * ```typescript
   * expect(el).toHaveText('Hello World');
   * ```
   */
  toHaveText: (expectedText: string, trimWhitespace?: boolean) => void;

  /**
   * Asserts that the received element's text matches the expected
   * library resource template pattern (ignoring interpolated values).
   * @param resourceKey The resource key to look up.
   * @example
   * ```typescript
   * await expect(el).toMatchLibResourceTemplate('sky_greeting');
   * ```
   */
  toMatchLibResourceTemplate: (resourceKey: string) => Promise<void>;

  /**
   * Asserts that the received element's text matches the expected
   * app resource template pattern (ignoring interpolated values).
   * @param resourceKey The resource key to look up.
   * @example
   * ```typescript
   * await expect(el).toMatchResourceTemplate('greeting');
   * ```
   */
  toMatchResourceTemplate: (resourceKey: string) => Promise<void>;
}
