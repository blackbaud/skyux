import {
  type ResourceStringResolver,
  isTemplateMatch,
} from '../utility/i18n-utils';
import type { ExpectationResult } from './expectation-result';

export async function elementMatchesResourceTemplate(
  el: Element,
  resolveResourceString: ResourceStringResolver,
  resourceKey: string,
): Promise<ExpectationResult> {
  const actualText = el.textContent ?? '';
  const expectedText = await resolveResourceString(resourceKey);

  const pass = isTemplateMatch(actualText, expectedText);

  return {
    pass,
    message: () =>
      pass
        ? `Expected element's text "${actualText}" not to match "${expectedText}"`
        : `Expected element's text "${actualText}" to match "${expectedText}"`,
  };
}
