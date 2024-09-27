import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';

import { createESLintRule } from '../utils/create-eslint-rule';

export const RULE_NAME = 'no-unbound-id';
export const messageId = 'noUnboundId';

export const rule = createESLintRule({
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
            messageId,
            data: {
              selector: el.name,
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
      [messageId]:
        '<{{selector}} /> element must not have a static ID. Use the `skyId` directive instead.',
    },
    schema: [],
    type: 'problem',
  },
  name: `template/${RULE_NAME}`,
});
