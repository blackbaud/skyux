import { MatcherResult } from './matcher-result';

/**
 * @internal
 */
export function _skyTestingHasStyle(
  el: Element,
  expectedStyles: Record<string, string>,
): MatcherResult {
  const messages: string[] = [];
  let hasFailure = false;

  for (const styleName of Object.keys(expectedStyles)) {
    const styles = window.getComputedStyle(el);
    const actualStyle = styles.getPropertyValue(styleName);
    const expectedStyle = expectedStyles[styleName];

    if (actualStyle !== expectedStyle) {
      if (!hasFailure) {
        hasFailure = true;
      }

      messages.push(
        `Expected element to have CSS style "${styleName}: ${expectedStyle}"`,
      );
    } else {
      messages.push(
        `Expected element not to have CSS style "${styleName}: ${expectedStyle}"`,
      );
    }

    messages.push(`Actual styles are: "${styleName}: ${actualStyle}"`);
  }

  return {
    pass: !hasFailure,
    message: messages.join('\n'),
  };
}
