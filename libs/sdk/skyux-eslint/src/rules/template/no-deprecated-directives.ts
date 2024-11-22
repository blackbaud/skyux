import {
  type TmplAstBoundAttribute,
  type TmplAstElement,
  type TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';
import { type RuleListener } from '@typescript-eslint/utils/ts-eslint';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

import { type DeprecatedDirective } from './types/deprecation';
import { getDeprecations } from './utility/get-deprecations';
import { parseDirectiveSelectors } from './utility/parse-directive-selectors';

const DEPRECATIONS = getDeprecations();

export const RULE_NAME = 'no-deprecated-directives';

export const rule = createESLintTemplateRule({
  create(context) {
    const parserServices = getTemplateParserServices(context);

    const reportDeprecatedDirective = (
      el: TmplAstElement | TmplAstBoundAttribute | TmplAstTextAttribute,
      docs: DeprecatedDirective,
    ): void => {
      context.report({
        loc: parserServices.convertNodeSourceSpanToLoc(el.sourceSpan),
        messageId: 'noDeprecatedDirectives',
        data: {
          reason: docs?.reason ?? '',
          selector: el.name,
        },
      });
    };

    const reportDeprecatedInputsOutputs = (
      el: TmplAstElement,
      docs: DeprecatedDirective,
    ): void => {
      if (docs.properties) {
        for (const property of docs.properties) {
          const attr =
            el.inputs.find((input) => input.name === property.name) ||
            el.outputs.find((output) => output.name === property.name) ||
            el.attributes.find((attr) => attr.name === property.name);

          if (attr) {
            context.report({
              loc: parserServices.convertNodeSourceSpanToLoc(attr.sourceSpan),
              messageId: 'noDeprecatedDirectiveProperties',
              data: {
                property: property.name,
                reason: property.reason ?? '',
                selector: el.name,
              },
            });
          }
        }
      }
    };

    const rules: RuleListener = {};

    if (DEPRECATIONS.components !== undefined) {
      const components = DEPRECATIONS.components;
      const selectors = Object.keys(components).join('|');

      rules[`Element$1[name=/^(${selectors})$/]`] = (
        el: TmplAstElement,
      ): void => {
        const docs = components[el.name];

        if (docs.deprecated) {
          reportDeprecatedDirective(el, docs);
        } else {
          reportDeprecatedInputsOutputs(el, docs);
        }
      };
    }

    if (DEPRECATIONS.directives !== undefined) {
      const selectors = parseDirectiveSelectors(DEPRECATIONS.directives);

      for (const selector of selectors) {
        const ruleId = selector.element
          ? `Element$1[name=${selector.element}] > :matches(BoundAttribute, TextAttribute)[name="${selector.attr}"]`
          : `:matches(BoundAttribute, TextAttribute)[name="${selector.attr}"]`;

        rules[ruleId] = (
          node: (TmplAstBoundAttribute | TmplAstTextAttribute) & {
            parent: TmplAstElement;
          },
        ): void => {
          const docs = selector.directive;

          if (docs.deprecated) {
            reportDeprecatedDirective(node, docs);
          } else {
            reportDeprecatedInputsOutputs(node.parent, docs);
          }
        };
      }
    }

    return rules;
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Prevents usage of deprecated directives and components in consumer templates.',
    },
    messages: {
      noDeprecatedDirectives:
        '<{{selector}}> element is deprecated. {{reason}}',
      noDeprecatedDirectiveProperties:
        'The attribute `{{property}}` on the <{{selector}}> element is deprecated. {{reason}}',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
