import type { _SkyTestingCheckVisibilityOptions } from './check-visibility-options';
import type { MatcherResult } from './matcher-result';

const DEFAULTS: _SkyTestingCheckVisibilityOptions = {
  checkCssDisplay: true,
  checkCssVisibility: false,
  checkDimensions: false,
};

/**
 * @internal
 */
export function _skyTestingCheckVisibility(
  el: Element | null | undefined,
  options?: _SkyTestingCheckVisibilityOptions,
): MatcherResult {
  const settings = { ...DEFAULTS, ...options };

  let pass = !!el;

  if (el) {
    const computedStyle = window.getComputedStyle(el);

    if (settings.checkCssDisplay) {
      pass = pass && computedStyle.display !== 'none';
    }

    if (settings.checkCssVisibility) {
      pass = pass && computedStyle.visibility !== 'hidden';
    }

    if (settings.checkDimensions) {
      const box = el.getBoundingClientRect();
      pass = pass && box.width > 0 && box.height > 0;
    }
  }

  return {
    pass,
    message: pass
      ? 'Expected element to not be visible'
      : 'Expected element to be visible',
  };
}
