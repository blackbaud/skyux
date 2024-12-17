import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'radio-group-with-nested-list';
export const messageId = 'radioGroupWithNestedList';

export const rule = createESLintTemplateRule({
  create(context) {
    const parserServices = getTemplateParserServices(context);

    return {
      [`Element$1[name=/^(sky-radio-group)$/]`](el: TmplAstElement): void {
        el.children.forEach((child) => {
          if (
            child instanceof TmplAstElement &&
            (child.name === 'ul' || child.name === 'ol')
          ) {
            context.report({
              loc: parserServices.convertNodeSourceSpanToLoc(child.sourceSpan),
              messageId,
              data: {},
            });
          }
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: '',
    },
    messages: {
      [messageId]: 'Do not nest lists within a sky-radiogroup.',
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
