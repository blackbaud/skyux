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
  private static analyzer = axe;

  public static run(
    element?: axe.ElementContext,
    config?: SkyA11yAnalyzerConfig
  ): Promise<void> {
    if (element === undefined) {
      throw new Error('No element was specified for accessibility checking.');
    }

    const defaults: SkyA11yAnalyzerConfig = {
      skyTheme: 'default',
      rules: {},
    };

    // Reset config.
    SkyA11yAnalyzer.analyzer.reset();

    // Disable all rules.
    SkyA11yAnalyzer.analyzer.configure({
      disableOtherRules: true,
    });

    const skyTheme = config?.skyTheme ?? defaults.skyTheme;

    // Enable certain rules based on theme.
    axe
      .getRules(
        skyTheme === 'default'
          ? ['wcag2a', 'wcag2aa', 'best-practice']
          : ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
      )
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

      SkyA11yAnalyzer.analyzer.run(
        element,
        { rules: { ...defaults.rules, ...(config?.rules || {}) } },
        callback
      );
    });
  }
}
