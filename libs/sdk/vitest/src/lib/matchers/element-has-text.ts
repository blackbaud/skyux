import type { ExpectationResult } from './expectation-result.js';

export function elementHasText(
  el: Element,
  expectedText: string,
  trimWhitespace: boolean,
): ExpectationResult {
  let actualText = el.textContent ?? '';

  if (trimWhitespace) {
    actualText = actualText.trim();
  }

  const pass = actualText === expectedText;

  return {
    pass,
    message: () =>
      pass
        ? `Expected element's text content "${actualText}" not to be: "${expectedText}"`
        : `Expected element's text content to be: "${expectedText}"\n` +
          `Actual element's text content was: "${actualText}"`,
  };
}
