import { expect } from 'vitest';

import { elementExists } from './matchers/element-exists';
import { elementHasCssClass } from './matchers/element-has-css-class';
import { elementHasResourceText } from './matchers/element-has-resource-text';
import { elementHasStyle } from './matchers/element-has-style';
import { elementHasText } from './matchers/element-has-text';
import { elementIsAccessible } from './matchers/element-is-accessible';
import { elementIsVisible } from './matchers/element-is-visible';
import { elementMatchesResourceTemplate } from './matchers/element-matches-resource-template';
import { resourceTextEquals } from './matchers/resource-text-equals';
import type { SkyToBeAccessibleOptions } from './matchers/to-be-accessible-options';
import type { SkyToBeVisibleOptions } from './matchers/to-be-visible-options';
import {
  getLibResourceString,
  getResourceString,
} from './matchers/utility/i18n-utils';

function assertElement(el: Element | null | undefined, name: string): Element {
  if (!el) {
    throw new Error(`${name} expects an Element.`);
  }

  return el;
}

expect.extend({
  toBeAccessible: elementIsAccessible,
  toBeVisible: elementIsVisible,
  toExist: elementExists,

  toEqualLibResourceText: (
    actualText: string,
    resourceKey: string,
    resourceArgs?: unknown[],
  ) =>
    resourceTextEquals(
      actualText,
      getLibResourceString,
      resourceKey,
      resourceArgs,
    ),

  toEqualResourceText: (
    actualText: string,
    resourceKey: string,
    resourceArgs?: unknown[],
  ) =>
    resourceTextEquals(
      actualText,
      getResourceString,
      resourceKey,
      resourceArgs,
    ),

  toHaveCssClass: (el: Element | null | undefined, expectedClassName: string) =>
    elementHasCssClass(assertElement(el, 'toHaveCssClass'), expectedClassName),

  toHaveStyle: (
    el: Element | null | undefined,
    expectedStyles: Record<string, string>,
  ) => elementHasStyle(assertElement(el, 'toHaveStyle'), expectedStyles),

  toHaveText: (
    el: Element | null | undefined,
    expectedText: string,
    trimWhitespace = true,
  ) =>
    elementHasText(
      assertElement(el, 'toHaveText'),
      expectedText,
      trimWhitespace,
    ),

  toHaveLibResourceText: (
    el: Element | null | undefined,
    resourceKey: string,
    resourceArgs?: unknown[],
    trimWhitespace = true,
  ) =>
    elementHasResourceText(
      assertElement(el, 'toHaveLibResourceText'),
      getLibResourceString,
      resourceKey,
      resourceArgs,
      trimWhitespace,
    ),

  toHaveResourceText: (
    el: Element | null | undefined,
    resourceKey: string,
    resourceArgs?: unknown[],
    trimWhitespace = true,
  ) =>
    elementHasResourceText(
      assertElement(el, 'toHaveResourceText'),
      getResourceString,
      resourceKey,
      resourceArgs,
      trimWhitespace,
    ),

  toMatchLibResourceTemplate: (
    el: Element | null | undefined,
    resourceKey: string,
  ) =>
    elementMatchesResourceTemplate(
      assertElement(el, 'toMatchLibResourceTemplate'),
      getLibResourceString,
      resourceKey,
    ),

  toMatchResourceTemplate: (
    el: Element | null | undefined,
    resourceKey: string,
  ) =>
    elementMatchesResourceTemplate(
      assertElement(el, 'toMatchResourceTemplate'),
      getResourceString,
      resourceKey,
    ),
});

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
}

export type { SkyToBeAccessibleOptions } from './matchers/to-be-accessible-options';
export type { SkyToBeVisibleOptions } from './matchers/to-be-visible-options';
