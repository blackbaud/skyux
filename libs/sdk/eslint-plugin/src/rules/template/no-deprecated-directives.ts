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

export const RULE_NAME = 'no-deprecated-directives';

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
                  property: input.name,
                  reason: property?.reason,
                  selector: el.name,
                },
              });
            } else {
              const output = el.outputs.find((output) => {
                property = directive.outputs?.find(
                  (o) => o.name === output.name,
                );
                return !!property;
              });

              if (output) {
                context.report({
                  loc: parserServices.convertNodeSourceSpanToLoc(
                    output.sourceSpan,
                  ),
                  messageId: 'noDeprecatedDirectiveProperties',
                  data: {
                    property: output.name,
                    reason: property?.reason,
                    selector: el.name,
                  },
                });
              }
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
            reason: found?.reason,
            selector: el.name,
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
        '<{{selector}} /> element is deprecated. {{reason}}',
      noDeprecatedDirectiveProperties:
        'The attribute `{{property}}` on the <{{selector}} /> element is deprecated. {{reason}}',
    },
    schema: [],
    type: 'problem',
  },
  name: `template/${RULE_NAME}`,
});
