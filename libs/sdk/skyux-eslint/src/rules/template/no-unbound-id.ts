import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'no-unbound-id';
export const messageId = 'noUnboundId';

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      ['Element'](el: TmplAstElement): void {
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
      description: 'Prevents usage of static IDs on HTML elements.',
    },
    messages: {
      [messageId]:
        '<{{selector}}> element must not have a static ID. Use the `skyId` directive instead.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
