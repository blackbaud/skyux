import { _SkyA11yAnalyzer } from '../a11y/a11y-analyzer';
import { _SkyA11yAnalyzerConfig } from '../a11y/a11y-analyzer-config';
import { MatcherResult } from './matcher-result';

/**
 * @internal
 */
export async function _skyTestingCheckAccessibility(
  el: Element | Document,
  options?: _SkyA11yAnalyzerConfig,
): Promise<MatcherResult> {
  const target = el instanceof Document ? el.documentElement : el;

  if (!(target instanceof Element)) {
    throw new Error('toBeAccessible expects an Element or Document.');
  }

  try {
    await _SkyA11yAnalyzer.run(target, options);
    return {
      pass: true,
      message: 'Expected accessibility violations, but none were found.',
    };
  } catch (err) {
    return {
      pass: false,
      message: (err as Error).message,
    };
  }
}
