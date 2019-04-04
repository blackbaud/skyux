import { SkyA11yAnalyzerConfig } from './a11y-analyzer-config';

export abstract class SkyA11yAnalyzer {
  private static analyzer: any = require('axe-core');

  private static defaults: SkyA11yAnalyzerConfig = {
    rules: {
      'accesskeys': { enabled: true },
      'area-alt': { enabled: true },

      // TODO: this should be re-enabled when we upgrade to axe-core ^3.1.1 (https://github.com/dequelabs/axe-core/issues/961)
      'aria-allowed-attr': { enabled: false },
      'aria-required-attr': { enabled: true },
      'aria-required-children': { enabled: true },
      'aria-required-parent': { enabled: true },
      'aria-roles': { enabled: true },
      'aria-valid-attr': { enabled: true },
      'aria-valid-attr-value': { enabled: true },
      'audio-caption': { enabled: true },
      'blink': { enabled: true },
      'button-name': { enabled: true },
      'bypass': { enabled: true },
      'checkboxgroup': { enabled: true },
      'color-contrast': { enabled: true },
      'definition-list': { enabled: true },
      'dlitem': { enabled: true },
      'document-title': { enabled: true },
      'duplicate-id': { enabled: true },
      'empty-heading': { enabled: true },
      'frame-title': { enabled: true },
      'frame-title-unique': { enabled: true },
      'heading-order': { enabled: true },
      'html-has-lang': { enabled: true },
      'html-lang-valid': { enabled: true },
      'image-alt': { enabled: true },
      'image-redundant-alt': { enabled: true },
      'input-image-alt': { enabled: true },
      'label': { enabled: true },
      'layout-table': { enabled: true },
      'link-in-text-block': { enabled: true },
      'link-name': { enabled: true },
      'list': { enabled: true },
      'listitem': { enabled: true },
      'marquee': { enabled: true },
      'meta-refresh': { enabled: true },
      'meta-viewport': { enabled: true },
      'meta-viewport-large': { enabled: true },
      'object-alt': { enabled: true },
      'p-as-heading': { enabled: true },
      'radiogroup': { enabled: true },
      'scope-attr-valid': { enabled: true },
      'server-side-image-map': { enabled: true },
      'tabindex': { enabled: true },
      'table-duplicate-name': { enabled: true },
      'table-fake-caption': { enabled: true },
      'td-has-header': { enabled: true },
      'td-headers-attr': { enabled: true },
      'th-has-data-cells': { enabled: true },
      'valid-lang': { enabled: true },
      'video-caption': { enabled: true },
      'video-description': { enabled: true }
    }
  };

  // Istanbul has difficulty covering abstract classes.
  /*istanbul ignore next */
  constructor() { }

  public static run(element?: any, config?: SkyA11yAnalyzerConfig): Promise<any> {
    const settings = Object.assign({}, SkyA11yAnalyzer.defaults, config);

    return new Promise((resolve: Function, reject: Function) => {
      SkyA11yAnalyzer.analyzer.run(element, settings, (error: Error, results: any) => {
        if (error) {
          reject(error);
          return;
        }

        if (results.violations.length > 0) {
          const message = SkyA11yAnalyzer.parseMessage(results.violations);
          reject(new Error(message));
        }

        resolve();
      });
    });
  }

  private static parseMessage(violations: any[]): string {
    let message = 'Expected element to pass accessibility checks.\n\n';

    violations.forEach((violation: any) => {
      const wcagTags = violation.tags
        .filter((tag: any) => tag.match(/wcag\d{3}|^best*/gi))
        .join(', ');

      const html = violation.nodes.reduce((accumulator: string, node: any) => {
        return `${accumulator}\n${node.html}\n`;
      }, '       Elements:\n');

      const error = [
        `aXe - [Rule: \'${violation.id}\'] ${violation.help} - WCAG: ${wcagTags}`,
        `       Get help at: ${violation.helpUrl}\n`,
        `${html}\n\n`
      ].join('\n');

      message += `${error}\n`;
    });

    return message;
  }
}
