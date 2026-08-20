import type { ExpectationResult } from './types/expectation-result';
import { getResourceString, isTemplateMatch } from './utility/i18n-utils';

export async function elementMatchesResourceTemplate(
  el: Element,
  resourceKey: string,
): Promise<ExpectationResult> {
  const actualText = el.textContent ?? '';
  const expectedText = await getResourceString(resourceKey);

  const pass = isTemplateMatch(actualText, expectedText);

  return {
    pass,
    message: () =>
      pass
        ? `Expected element's text "${actualText}" not to match "${expectedText}"`
        : `Expected element's text "${actualText}" to match "${expectedText}"`,
  };
}
