import { expect } from 'vitest';

import { elementExists } from './matchers/element-exists.js';
import { elementHasCssClass } from './matchers/element-has-css-class.js';
import { elementHasResourceText } from './matchers/element-has-resource-text.js';
import { elementHasStyle } from './matchers/element-has-style.js';
import { elementHasText } from './matchers/element-has-text.js';
import { elementIsAccessible } from './matchers/element-is-accessible.js';
import { elementIsVisible } from './matchers/element-is-visible.js';
import { elementMatchesResourceTemplate } from './matchers/element-matches-resource-template.js';
import { resourceTextEquals } from './matchers/resource-text-equals.js';
import {
  getLibResourceString,
  getResourceString,
} from './utility/i18n-utils.js';

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

function assertElement(el: Element | null | undefined, name: string): Element {
  if (!el) {
    throw new Error(`${name} expects an Element.`);
  }

  return el;
}
