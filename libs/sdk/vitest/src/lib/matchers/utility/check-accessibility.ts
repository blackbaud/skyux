import { SkyA11yAnalyzer } from '../../a11y/a11y-analyzer';
import type { SkyA11yAnalyzerConfig } from '../../a11y/a11y-analyzer-config';
import type { MatcherResult } from './matcher-result';

export async function checkAccessibility(
  el: Element | Document,
  options?: SkyA11yAnalyzerConfig,
): Promise<MatcherResult> {
  const target = el instanceof Document ? el.documentElement : el;

  if (!(target instanceof Element)) {
    throw new Error('toBeAccessible expects an Element or Document.');
  }

  try {
    await SkyA11yAnalyzer.run(target, options);

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
