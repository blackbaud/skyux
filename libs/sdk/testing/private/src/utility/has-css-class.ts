import type { MatcherResult } from './matcher-result';

export function _skyTestingHasCssClass(
  el: Element,
  expectedClassName: string,
): MatcherResult {
  if (expectedClassName.indexOf('.') === 0) {
    throw new Error('Please remove the leading dot from your class name.');
  }

  const pass = el.classList.contains(expectedClassName);

  return {
    pass,
    message: pass
      ? `Expected element not to have CSS class "${expectedClassName}"`
      : `Expected element to have CSS class "${expectedClassName}"`,
  };
}
