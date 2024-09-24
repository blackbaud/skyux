import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';

import { createESLintRule } from '../../utils/create-eslint-rule';

export const RULE_NAME = 'no-deprecated-directives';

const DEPRECATED_SELECTORS = ['sky-card', 'sky-checkbox-label'].join('|');

const DEPRECATED_PROPERTIES: Record<string, Record<string, string[]>> = {
  'sky-checkbox': {
    inputs: ['label'],
  },
  'sky-file-attachment': {
    inputs: ['validatorFn'],
    outputs: ['fileChange'],
  },
};

const SELECTORS_WITH_DEPRECATED_PROPERTIES = Object.keys(
  DEPRECATED_PROPERTIES,
).join('|');

export const rule = createESLintRule({
  create(context) {
    const parserServices = getTemplateParserServices(context);

    return {
      [`Element$1[name=/^(${SELECTORS_WITH_DEPRECATED_PROPERTIES})$/]`](
        el: TmplAstElement,
      ) {
        for (const input of DEPRECATED_PROPERTIES[el.name]['inputs']) {
          const property = el.inputs.find((i) => i.name === input);

          if (property) {
            context.report({
              loc: parserServices.convertNodeSourceSpanToLoc(
                property.sourceSpan,
              ),
              messageId: 'noDeprecatedDirectiveProperties',
              data: {
                element: el.name,
                property: property.name,
              },
            });
          }
        }
      },
      [`Element$1[name=/^(${DEPRECATED_SELECTORS})$/]`](el: TmplAstElement) {
        context.report({
          loc: parserServices.convertNodeSourceSpanToLoc(el.sourceSpan),
          messageId: 'noDeprecatedDirectives',
          data: {
            element: el.name,
          },
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
      noDeprecatedDirectives:
        '<{{element}} /> element is deprecated and should not be used.',
      noDeprecatedDirectiveProperties:
        "The property {{property}} on the <{{element}} /> element is deprecated. Refer to the component's documentation for next steps.",
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
