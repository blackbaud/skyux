import type { ExpectationResult } from './types/expectation-result';

export function elementExists(
  el: Element | null | undefined,
): ExpectationResult {
  const pass = !!el;

  return {
    pass,
    message: () =>
      pass ? 'Expected element not to exist' : 'Expected element to exist',
  };
}
