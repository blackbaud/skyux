import type { _SkyTestingCheckVisibilityOptions } from './check-visibility-options';

const DEFAULTS: _SkyTestingCheckVisibilityOptions = {
  checkCssDisplay: true,
  checkCssVisibility: false,
  checkDimensions: false,
  checkExists: false,
};

/**
 * @internal
 */
export function _skyTestingCheckVisibility(
  el: Element,
  options?: _SkyTestingCheckVisibilityOptions,
): boolean {
  const settings = { ...DEFAULTS, ...options };

  let pass = true;

  if (settings.checkExists) {
    pass = !!el;
  }

  if (pass) {
    const computedStyle = window.getComputedStyle(el);

    if (settings.checkCssDisplay) {
      pass = computedStyle.display !== 'none';
    }

    if (settings.checkCssVisibility) {
      pass = computedStyle.visibility !== 'hidden';
    }

    if (settings.checkDimensions) {
      const box = el.getBoundingClientRect();
      pass = box.width > 0 && box.height > 0;
    }
  }

  return pass;
}
