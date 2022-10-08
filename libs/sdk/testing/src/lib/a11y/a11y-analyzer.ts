import axe from 'axe-core';

import { SkyA11yAnalyzerConfig } from './a11y-analyzer-config';

function parseMessage(violations: axe.Result[]): string {
  let message = 'Expected element to pass accessibility checks.\n\n';

  violations.forEach((violation) => {
    const wcagTags = violation.tags
      .filter((tag) => tag.match(/wcag\d{3}|^best*/gi))
      .join(', ');

    const html = violation.nodes.reduce(
      (accumulator: string, node: axe.NodeResult) => {
        return `${accumulator}\n${node.html}\n`;
      },
      '       Elements:\n'
    );

    const error = [
      `aXe - [Rule: '${violation.id}'] ${violation.help} - WCAG: ${wcagTags}`,
      `       Get help at: ${violation.helpUrl}\n`,
      `${html}\n\n`,
    ].join('\n');

    message += `${error}\n`;
  });

  return message;
}

export abstract class SkyA11yAnalyzer {
  public static run(
    element?: axe.ElementContext,
    config?: SkyA11yAnalyzerConfig
  ): Promise<void> {
    if (element === undefined) {
      throw new Error('No element was specified for accessibility checking.');
    }

    axe.reset();

    const defaults: SkyA11yAnalyzerConfig = {
      rules: {},
    };

    // Enable all rules by default.
    // aaa rules are disabled by default. Should we reconsider?
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
          const message = parseMessage(results.violations);
          reject(new Error(message));
        }

        resolve();
      };

      axe.run(element, { ...defaults, ...config }, callback);
    });
  }
}
