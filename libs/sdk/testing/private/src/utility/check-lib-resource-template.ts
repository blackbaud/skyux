import { getLibResourceString, isTemplateMatch } from './i18n-utils';
import { MatcherResult } from './matcher-result';

/**
 * @internal
 */
export async function _skyTestingCheckLibResourceTemplate(
  el: Element,
  resourceKey: string,
): Promise<MatcherResult> {
  const actualText = el.textContent;
  const expectedText = await getLibResourceString(resourceKey);

  const pass = isTemplateMatch(actualText, expectedText);

  return {
    pass,
    message: pass
      ? ''
      : `Expected element's text "${actualText}" to match "${expectedText}"`,
  };
}
