import type { ExpectationResult } from './types/expectation-result';

export function elementHasStyle(
  el: Element,
  expectedStyles: Record<string, string>,
): ExpectationResult {
  const styles = window.getComputedStyle(el);
  const mismatches: string[] = [];

  for (const [styleName, expectedStyle] of Object.entries(expectedStyles)) {
    const actualStyle = styles.getPropertyValue(styleName);

    if (actualStyle !== expectedStyle) {
      mismatches.push(
        `Expected element to have CSS style "${styleName}: ${expectedStyle}", but it was "${actualStyle}"`,
      );
    }
  }

  const pass = mismatches.length === 0;

  return {
    pass,
    message: () =>
      pass
        ? Object.entries(expectedStyles)
            .map(
              ([styleName, expectedStyle]) =>
                `Expected element not to have CSS style "${styleName}: ${expectedStyle}"`,
            )
            .join('\n')
        : mismatches.join('\n'),
  };
}
