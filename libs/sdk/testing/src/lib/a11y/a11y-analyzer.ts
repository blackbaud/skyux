import axe from 'axe-core';

import { SkyA11yAnalyzerConfig } from './a11y-analyzer-config';
import { SkyA11yAnalyzerElementContext } from './a11y-analyzer-element-context';

function formatViolations(results: axe.AxeResults): string {
  let message = `Expected element to pass accessibility checks.

The following violation(s) must be addressed:
---------------------------------------------
`;

  for (const violation of results.violations) {
    const tags = `Tags:             ${violation.tags.join(' ')}`;

    message += `
${violation.nodes.reduce(
  (accumulator: string, node: axe.NodeResult) =>
    `${accumulator}\n${node.html}\n`,
  ''
)}
Rule:             \x1b[31m${violation.id}\x1b[0m
Impact:           ${violation.impact || 'unknown'}
Description:      ${violation.description}
How to resolve:   ${violation.help}
More info:        ${violation.helpUrl}
${tags}
${'-'.repeat(tags.length)}
`;
  }

  return message;
}

export abstract class SkyA11yAnalyzer {
  public static run(
    element: SkyA11yAnalyzerElementContext | null | undefined,
    config?: SkyA11yAnalyzerConfig
  ): Promise<void> {
    if (!element) {
      throw new Error('No element was specified for accessibility checking.');
    }

    axe.reset();

    const defaults: SkyA11yAnalyzerConfig = {
      rules: {},
    };

    // Enable all rules by default?
    // AAA rules are disabled by default. Should we reconsider?
    axe
      .getRules([
        'wcag2a',
        'wcag2aa',
        // 'wcag2aaa',
        'wcag21a',
        'wcag21aa',
        // 'wcag21aaa',
        'best-practice',
      ])
      .forEach((rule) => {
        defaults.rules[rule.ruleId] = { enabled: true };
      });

    // Disable autocomplete-valid
    // Chrome browsers ignore autocomplete="off", which forces us to use non-standard values
    // to disable the browser's native autofill.
    // https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164
    defaults.rules['autocomplete-valid'] = { enabled: false };

    return new Promise((resolve, reject) => {
      const callback: axe.RunCallback = (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        if (results.violations.length > 0) {
          const message = formatViolations(results);
          reject(new Error(message));
        }

        resolve();
      };

      axe.run(element, { ...defaults, ...config }, callback);
    });
  }
}
