import * as axe from 'axe-core';

import { SkyA11yAnalyzerConfig } from './a11y-analyzer-config';

function parseMessage(violations: axe.Result[]): string {
  let message = 'Expected element to pass accessibility checks.\n\n';

  violations.forEach((violation) => {
    const wcagTags = violation.tags
      .filter((tag) => tag.match(/wcag\d{3}|^best*/gi))
      .join(', ');

    const nodeResults = violation.nodes.filter(
      filterViolationNodeResults(violation)
    );
    const html = nodeResults.reduce(
      (accumulator: string, node: axe.NodeResult) => {
        const related = [...node.all, ...node.none, ...node.any]
          .map((checkResult) => {
            const relatedNodes = checkResult.relatedNodes || [];
            let relatedHtml = relatedNodes
              .map((relatedNode) =>
                relatedNode.html.split(`\n`).join(`\n      `)
              )
              .join(`\n\n      `);
            if (relatedHtml) {
              relatedHtml = `\n    Related Nodes:\n\n      ${relatedHtml}`;
            }
            return `  - ${checkResult.message}${relatedHtml}`;
          })
          .join(`\n`);
        return `${accumulator}\n\n${node.failureSummary}\n${node.html}\n${related}`;
      },
      '       Elements:'
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

function filterViolationNodeResults(
  result: axe.Result
): (node: axe.NodeResult) => boolean {
  if (
    [
      'aria-required-children', // AG Grid uses some aria-hidden elements that axe doesn't like
      'aria-valid-attr', // AG Grid uses aria-description, which is still in draft
      'scrollable-region-focusable', // AG Grid handles scrolling
    ].includes(result.id)
  ) {
    return (node: axe.NodeResult) => !node.html.includes('class="ag-');
  } else {
    return () => true;
  }
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

    SkyA11yAnalyzer.analyzer.reset();

    const defaults: SkyA11yAnalyzerConfig = {
      rules: {},
    };

    // Disable autocomplete-valid
    // Chrome browsers ignore autocomplete="off", which forces us to use non-standard values
    // to disable the browser's native autofill.
    // https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164
    defaults.rules['autocomplete-valid'] = { enabled: false };

    return new Promise((resolve, reject) => {
      const callback: axe.RunCallback = (error, results) => {
        if (error?.message) {
          reject(error);
          return;
        }

        const violations = results.violations.filter((violation) =>
          violation.nodes.some(filterViolationNodeResults(violation))
        );
        if (violations.length > 0) {
          const message = parseMessage(violations);
          reject(new Error(message));
        }

        resolve();
      };

      SkyA11yAnalyzer.analyzer.run(
        element,
        { ...defaults, ...config },
        callback
      );
    });
  }
}
