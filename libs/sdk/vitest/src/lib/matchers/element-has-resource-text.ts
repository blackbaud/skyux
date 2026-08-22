import type { ResourceStringResolver } from '../utility/i18n-utils.js';
import type { ExpectationResult } from './expectation-result.js';

export async function elementHasResourceText(
  el: Element,
  resolveResourceString: ResourceStringResolver,
  resourceKey: string,
  resourceArgs: unknown[] | undefined,
  trimWhitespace: boolean,
): Promise<ExpectationResult> {
  const expectedText = await resolveResourceString(resourceKey, resourceArgs);

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
