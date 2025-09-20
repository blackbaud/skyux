import type { TmplAstTextAttribute } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';
import type { RuleFix } from '@typescript-eslint/utils/ts-eslint';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'no-deprecated-classnames';
export const messageId = 'noDeprecatedClassnames';

/**
 * A map of deprecated classnames to their replacements.
 */
export const DEPRECATED_CLASSNAMES: Record<string, string> = {
  'sky-margin-inline-compact': 'sky-margin-inline-xs',
  'sky-margin-inline-default': 'sky-margin-inline-sm',
  'sky-margin-stacked-compact': 'sky-margin-stacked-xs',
  'sky-margin-stacked-default': 'sky-margin-stacked-lg',
  'sky-margin-stacked-separate': 'sky-margin-stacked-xl',
  'sky-padding-even-default': 'sky-padding-even-md',
  'sky-padding-even-large': 'sky-padding-even-xl',
  'sky-page-heading': 'sky-font-heading-1',
  'sky-section-heading': 'sky-font-heading-2',
  'sky-subsection-heading': 'sky-font-heading-3',
  'sky-headline': 'sky-font-display-3',
  'sky-emphasized': 'sky-font-emphasized',
  'sky-deemphasized': 'sky-font-deemphasized',
  'sky-field-label': 'sky-font-data-label',
};

function getDeprecatedClasses(
  existingClasses: string[],
): Record<string, string> {
  const found: Record<string, string> = {};

  for (const existingClassname of existingClasses) {
    const replacement = DEPRECATED_CLASSNAMES[existingClassname];

    if (replacement) {
      found[existingClassname] = DEPRECATED_CLASSNAMES[existingClassname];
    }
  }

  return found;
}

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      [`Element > :matches(TextAttribute)[name="class"]`](
        attr: TmplAstTextAttribute,
      ): void {
        const existing = attr.value.split(' ');
        const found = getDeprecatedClasses(existing);

        const deprecatedClasses = Object.keys(found);
        const replacementClasses = Object.values(found);

        if (deprecatedClasses.length > 0) {
          for (const deprecatedClassname of deprecatedClasses) {
            const index = existing.indexOf(deprecatedClassname);

            if (index > -1) {
              existing[index] = found[deprecatedClassname];
            }
          }

          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(attr.sourceSpan),
            messageId,
            data: {
              deprecated: deprecatedClasses.join(', '),
              replacement: replacementClasses.join(', '),
            },
            fix: () => {
              const fixers: RuleFix[] = [];

              if (attr.valueSpan) {
                fixers.push({
                  range: [
                    attr.valueSpan.start.offset,
                    attr.valueSpan.end.offset,
                  ],
                  text: existing.join(' '),
                });
              }

              return fixers;
            },
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Avoid using deprecated CSS classes.',
    },
    messages: {
      [messageId]:
        'The CSS classes ({{deprecated}}) are deprecated. Use ({{replacement}}) instead.',
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
