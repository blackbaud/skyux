import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';

import deprecationsJson from '../../__deprecations.json';
import { createESLintRule } from '../../utils/create-eslint-rule';

const DEPRECATIONS = deprecationsJson as {
  directives: {
    selectors: DeprecatedDirective[];
    properties: DeprecatedProperties[];
  };
};

interface DeprecatedDirective {
  selector: string;
  reason: string;
}

interface DeprecatedProperty {
  name: string;
  reason: string;
}

interface DeprecatedProperties {
  selector: string;
  inputs?: DeprecatedProperty[];
  outputs?: DeprecatedProperty[];
}

export const RULE_NAME = 'template/no-deprecated-directives';

// const DEPRECATED_SELECTORS = ['sky-card', 'sky-checkbox-label'].join('|');

// const DEPRECATED_PROPERTIES: Record<string, Record<string, string[]>> = {
//   'sky-checkbox': {
//     inputs: ['label'],
//   },
//   'sky-file-attachment': {
//     inputs: ['validatorFn'],
//     outputs: ['fileChange'],
//   },
// };

// const SELECTORS_WITH_DEPRECATED_PROPERTIES = Object.keys(
//   DEPRECATED_PROPERTIES,
// ).join('|');

const DEPRECATED_SELECTORS = DEPRECATIONS.directives.selectors
  .map((s) => s.selector)
  .join('|');

const SELECTORS_WITH_DEPRECATED_PROPERTIES = DEPRECATIONS.directives.properties
  .map((p) => p.selector)
  .join('|');

export const rule = createESLintRule({
  create(context) {
    const parserServices = getTemplateParserServices(context);

    return {
      [`Element$1[name=/^(${SELECTORS_WITH_DEPRECATED_PROPERTIES})$/]`](
        el: TmplAstElement,
      ) {
        for (const directive of DEPRECATIONS.directives.properties) {
          if (directive.selector === el.name) {
            let property: DeprecatedProperty | undefined;

            const input = el.inputs.find((input) => {
              property = directive.inputs?.find((i) => i.name === input.name);
              return !!property;
            });

            if (input) {
              context.report({
                loc: parserServices.convertNodeSourceSpanToLoc(
                  input.sourceSpan,
                ),
                messageId: 'noDeprecatedDirectiveProperties',
                data: {
                  element: el.name,
                  property: input.name,
                  reason: property?.reason,
                },
              });
            }
          }
        }
      },
      [`Element$1[name=/^(${DEPRECATED_SELECTORS})$/]`](el: TmplAstElement) {
        const found = DEPRECATIONS.directives.selectors.find(
          (s) => s.selector === el.name,
        );

        context.report({
          loc: parserServices.convertNodeSourceSpanToLoc(el.sourceSpan),
          messageId: 'noDeprecatedDirectives',
          data: {
            element: el.name,
            reason: found?.reason,
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
      noDeprecatedDirectives: '<{{element}} /> is deprecated. {{reason}}',
      noDeprecatedDirectiveProperties:
        'The property {{property}} on the <{{element}} /> element is deprecated. {{reason}}',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
