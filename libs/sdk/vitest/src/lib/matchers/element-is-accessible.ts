import { SkyA11yAnalyzer } from '../utility/a11y-analyzer';
import type { SkyA11yAnalyzerConfig } from '../utility/a11y-analyzer-config';
import type { ExpectationResult } from './expectation-result';

export async function elementIsAccessible(
  el: Element | Document,
  options?: SkyA11yAnalyzerConfig,
): Promise<ExpectationResult> {
  const target = el instanceof Document ? el.documentElement : el;

  if (!(target instanceof Element)) {
    throw new Error('toBeAccessible expects an Element or Document.');
  }

  try {
    await SkyA11yAnalyzer.run(target, options);

    return {
      pass: true,
      message: () => 'Expected accessibility violations, but none were found.',
    };
  } catch (err) {
    return {
      pass: false,
      message: () => (err as Error).message,
    };
  }
}
