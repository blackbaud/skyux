import type { ExpectationResult } from './types/expectation-result';
import { getLibResourceString } from './utility/i18n-utils';

export async function elementHasLibResourceText(
  el: Element,
  resourceKey: string,
  resourceArgs: unknown[] = [],
  trimWhitespace: boolean,
): Promise<ExpectationResult> {
  const expectedText = await getLibResourceString(resourceKey, resourceArgs);

  let actualText = el.textContent ?? '';

  if (trimWhitespace) {
    actualText = actualText.trim();
  }

  const pass = actualText === expectedText;

  return {
    pass,
    message: () =>
      pass
        ? `Expected element's inner text "${actualText}" not to be "${expectedText}"`
        : `Expected element's inner text "${actualText}" to be "${expectedText}"`,
  };
}
