import { getResourceString } from './i18n-utils';
import type { MatcherResult } from './matcher-result';

/**
 * @internal
 */
export async function _skyTestingHasResourceText(
  el: Element,
  resourceKey: string,
  resourceArgs: unknown[] = [],
  trimWhitespace: boolean,
): Promise<MatcherResult> {
  const expectedText = await getResourceString(resourceKey, resourceArgs);

  let actualText = el.textContent ?? '';

  if (trimWhitespace) {
    actualText = actualText.trim();
  }

  const pass = actualText === expectedText;

  return {
    pass,
    message: pass
      ? `Expected element's inner text "${actualText}" not to be "${expectedText}"`
      : `Expected element's inner text "${actualText}" to be "${expectedText}"`,
  };
}
