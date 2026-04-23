import { MatcherResult } from './matcher-result';

export function _skyTestingHasText(
  el: Element,
  expectedText: string,
  trimWhitespace: boolean,
): MatcherResult {
  let actualText = el.textContent ?? '';

  if (trimWhitespace) {
    actualText = actualText.trim();
  }

  const pass = actualText === expectedText;

  return {
    pass,
    message: pass
      ? `Expected element's inner text "${actualText}" not to be: "${expectedText}"`
      : `Expected element's inner text to be: "${expectedText}"\n` +
        `Actual element's inner text was: "${actualText}"`,
  };
}
