import type { ExpectationResult } from './types/expectation-result';

interface ElementIsVisibleOptions {
  checkCssDisplay?: boolean;
  checkCssVisibility?: boolean;
  checkDimensions?: boolean;
  checkExists?: boolean;
}

const DEFAULTS: ElementIsVisibleOptions = {
  checkCssDisplay: true,
  checkCssVisibility: false,
  checkDimensions: false,
};

export function elementIsVisible(
  el: Element | null | undefined,
  options?: ElementIsVisibleOptions,
): ExpectationResult {
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
    message: () =>
      pass
        ? 'Expected element to not be visible'
        : 'Expected element to be visible',
  };
}
