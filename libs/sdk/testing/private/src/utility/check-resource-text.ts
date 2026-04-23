import { getResourceString } from './i18n-utils';
import { MatcherResult } from './matcher-result';

/**
 * @internal
 */
export async function _skyTestingCheckResourceText(
  actualText: string,
  resourceKey: string,
  resourceArgs?: unknown[],
): Promise<MatcherResult> {
  const expectedText = await getResourceString(resourceKey, resourceArgs);

  const pass = actualText === expectedText;

  return {
    pass,
    message: pass
      ? `Expected "${actualText}" not to equal "${expectedText}"`
      : `Expected "${actualText}" to equal "${expectedText}"`,
  };
}
