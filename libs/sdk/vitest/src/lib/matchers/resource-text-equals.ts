import type { ResourceStringResolver } from '../utility/i18n-utils';
import type { ExpectationResult } from './expectation-result';

export async function resourceTextEquals(
  actualText: string,
  resolveResourceString: ResourceStringResolver,
  resourceKey: string,
  resourceArgs?: unknown[],
): Promise<ExpectationResult> {
  const expectedText = await resolveResourceString(resourceKey, resourceArgs);

  const pass = actualText === expectedText;

  return {
    pass,
    message: () =>
      pass
        ? `Expected "${actualText}" not to equal "${expectedText}"`
        : `Expected "${actualText}" to equal "${expectedText}"`,
  };
}
