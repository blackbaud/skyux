import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';

import { createESLintRule } from '../../utils/create-eslint-rule';

export const RULE_NAME = 'no-unbound-id';

/**
 * [Bad practice]
 */
export const noUnboundId = createESLintRule({
  create(context) {
    const parserServices = getTemplateParserServices(context);

    return {
      ['Element$1'](el: TmplAstElement) {
        const found = el.attributes.find((attribute) => {
          return attribute.name === 'id';
        });

        if (found) {
          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(found.sourceSpan),
            messageId: 'noUnboundId',
            data: {
              element: el.name,
            },
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'ID must be unique.',
    },
    messages: {
      noUnboundId: '<{{element}} /> element must not have a static ID.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
