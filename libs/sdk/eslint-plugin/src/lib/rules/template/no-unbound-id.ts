import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export const RULE_NAME = 'no-unbound-id';

const ruleCreator = ESLintUtils.RuleCreator((ruleName) => {
  return `https://github.com/blackbaud/skyux/blob/main/libs/cdk/eslint-plugin/docs/rules/${ruleName}.md`;
});

export const noUnboundId = ruleCreator({
  create(context) {
    const parserServices = getTemplateParserServices(context);

    return {
      ['Element$1'](el: TmplAstElement) {
        const found = el.attributes.find(({ name }) => {
          return name === 'id';
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
