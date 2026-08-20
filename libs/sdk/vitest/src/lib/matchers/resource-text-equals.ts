import type { ExpectationResult } from './types/expectation-result';
import { getResourceString } from './utility/i18n-utils';

export async function resourceTextEquals(
  actualText: string,
  resourceKey: string,
  resourceArgs?: unknown[],
): Promise<ExpectationResult> {
  const expectedText = await getResourceString(resourceKey, resourceArgs);

  const pass = actualText === expectedText;

  return {
    pass,
    message: () =>
      pass
        ? `Expected "${actualText}" not to equal "${expectedText}"`
        : `Expected "${actualText}" to equal "${expectedText}"`,
  };
}
