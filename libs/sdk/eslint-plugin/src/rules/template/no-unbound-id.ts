import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';

import { createESLintRule } from '../../utils/create-eslint-rule';

export const RULE_NAME = 'template/no-unbound-id';

/**
 * [Bad practice]
 */
export const noUnboundId = createESLintRule({
  create(context) {
    const parserServices = getTemplateParserServices(context);

    return {
      ['Element$1'](el: TmplAstElement) {
        const idAttr = el.attributes.find((attribute) => {
          return attribute.name === 'id';
        });

        if (idAttr) {
          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(idAttr.sourceSpan),
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
      noUnboundId:
        '<{{element}} /> element must not have a static ID. Use the `skyId` directive instead.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
