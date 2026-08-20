import type { ExpectationResult } from './types/expectation-result';
import { getResourceString } from './utility/i18n-utils';

export async function elementHasResourceText(
  el: Element,
  resourceKey: string,
  resourceArgs: unknown[] = [],
  trimWhitespace: boolean,
): Promise<ExpectationResult> {
  const expectedText = await getResourceString(resourceKey, resourceArgs);

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
