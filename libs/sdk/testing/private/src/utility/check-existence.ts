import type { MatcherResult } from './matcher-result';

/**
 * @internal
 */
export function _skyTestingCheckExistence(
  el: Element | null | undefined,
): MatcherResult {
  const pass = !!el;

  return {
    pass,
    message: pass
      ? 'Expected element not to exist'
      : 'Expected element to exist',
  };
}
