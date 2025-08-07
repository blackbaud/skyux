import type {
  TmplAstBoundAttribute,
  TmplAstElement,
  TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';
import type { RuleListener } from '@typescript-eslint/utils/ts-eslint';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

import { getDeprecatedTemplateFeatures } from './utils/get-deprecated-template-features';
import { getDirectiveSelectorDetails } from './utils/get-directive-selector-details';
import type { DeprecatedDirective } from './utils/types';

const DEPRECATIONS = getDeprecatedTemplateFeatures();

export const RULE_NAME = 'no-deprecated-directives';

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    const reportDeprecatedDirective = (
      el: TmplAstElement | TmplAstBoundAttribute | TmplAstTextAttribute,
      directive: DeprecatedDirective,
    ): void => {
      context.report({
        loc: parserServices.convertNodeSourceSpanToLoc(el.sourceSpan),
        messageId: 'noDeprecatedDirectives',
        data: {
          reason: directive.deprecationReason ?? '',
          selector: el.name,
        },
      });
    };

    const reportDeprecatedInputsOutputs = (
      el: TmplAstElement,
      directive: DeprecatedDirective,
    ): void => {
      if (directive.properties) {
        for (const property of directive.properties) {
          const propertyName = property.name;

          const attr =
            el.inputs.find((input) => input.name === propertyName) ||
            el.outputs.find((output) => output.name === propertyName) ||
            el.attributes.find((attr) => attr.name === propertyName);

          if (attr) {
            context.report({
              loc: parserServices.convertNodeSourceSpanToLoc(attr.sourceSpan),
              messageId: 'noDeprecatedDirectiveProperties',
              data: {
                property: propertyName,
                reason: property.deprecationReason ?? '',
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
      const selectors = components
        .map((component) => component.selector)
        .join('|');

      rules[`Element[name=/^(${selectors})$/]`] = (
        el: TmplAstElement,
      ): void => {
        const docs = components.find((c) => c.selector === el.name);

        /* istanbul ignore else: safety check */
        if (docs) {
          if (docs.isDeprecated) {
            reportDeprecatedDirective(el, docs);
          } else {
            reportDeprecatedInputsOutputs(el, docs);
          }
        }
      };
    }

    if (DEPRECATIONS.directives !== undefined) {
      const details = getDirectiveSelectorDetails(DEPRECATIONS.directives);

      for (const detail of details) {
        const ruleId = detail.elementName
          ? // The directive is defined as an attribute of a specific element.
            `Element[name=${detail.elementName}] > :matches(BoundAttribute, TextAttribute)[name="${detail.templateBindingName}"]`
          : // The directive is defined as an attribute of any element.
            `:matches(BoundAttribute, TextAttribute)[name="${detail.templateBindingName}"]`;

        rules[ruleId] = (
          node: (TmplAstBoundAttribute | TmplAstTextAttribute) & {
            parent: TmplAstElement;
          },
        ): void => {
          const directive = detail.parent;

          if (directive.isDeprecated) {
            reportDeprecatedDirective(node, directive);
          } else {
            reportDeprecatedInputsOutputs(node.parent, directive);
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
