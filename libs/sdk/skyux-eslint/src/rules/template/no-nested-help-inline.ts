import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'no-nested-help-inline';
export const messageId = 'noNestedHelpInline';

const WRAPPERS_WITHOUT_HELP_SUPPORT = new Set([
  'sky-alert',
  'sky-label',
  'sky-token',
]);

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      ['Element[name=sky-help-inline]'](element: TmplAstElement): void {
        const ancestors = (
          context.sourceCode.getAncestors(element as never) as unknown[]
        ).filter((ancestor) => ancestor instanceof TmplAstElement);

        const wrapper = ancestors.find((ancestor) =>
          WRAPPERS_WITHOUT_HELP_SUPPORT.has(ancestor.name),
        );

        if (!wrapper) {
          return;
        }

        context.report({
          loc: parserServices.convertNodeSourceSpanToLoc(element.sourceSpan),
          messageId,
          data: { element: wrapper.name },
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow nesting sky-help-inline within SKY UX components that do not support it.',
    },
    messages: {
      [messageId]:
        'Do not nest sky-help-inline within {{element}}, which does not support it.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
