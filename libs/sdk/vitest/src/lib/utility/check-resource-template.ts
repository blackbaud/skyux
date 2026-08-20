import { getResourceString, isTemplateMatch } from './i18n-utils';
import type { MatcherResult } from './matcher-result';

export async function checkResourceTemplate(
  el: Element,
  resourceKey: string,
): Promise<MatcherResult> {
  const actualText = el.textContent ?? '';
  const expectedText = await getResourceString(resourceKey);

  const pass = isTemplateMatch(actualText, expectedText);

  return {
    pass,
    message: pass
      ? `Expected element's text "${actualText}" not to match "${expectedText}"`
      : `Expected element's text "${actualText}" to match "${expectedText}"`,
  };
}
