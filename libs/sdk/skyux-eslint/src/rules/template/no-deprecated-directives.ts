import {
  type TmplAstBoundAttribute,
  type TmplAstElement,
  type TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';
import {
  SkyManifestDeprecatedDirective,
  type SkyManifestPublicApi,
  getDeprecatedTemplateFeatures,
} from '@skyux/manifest';
import publicApi from '@skyux/manifest/public-api.json';
import { type RuleListener } from '@typescript-eslint/utils/ts-eslint';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

import { parseDirectiveSelectors } from './utils/parse-directive-selectors';

const DEPRECATIONS = getDeprecatedTemplateFeatures(
  publicApi as SkyManifestPublicApi,
);

export const RULE_NAME = 'no-deprecated-directives';

export const rule = createESLintTemplateRule({
  create(context) {
    const parserServices = getTemplateParserServices(context);

    const reportDeprecatedDirective = (
      el: TmplAstElement | TmplAstBoundAttribute | TmplAstTextAttribute,
      docs: SkyManifestDeprecatedDirective,
    ): void => {
      context.report({
        loc: parserServices.convertNodeSourceSpanToLoc(el.sourceSpan),
        messageId: 'noDeprecatedDirectives',
        data: {
          reason: docs.deprecationReason ?? '',
          selector: el.name,
        },
      });
    };

    const reportDeprecatedInputsOutputs = (
      el: TmplAstElement,
      docs: SkyManifestDeprecatedDirective,
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
      const selectors = components.map((c) => c.selector).join('|');

      rules[`Element$1[name=/^(${selectors})$/]`] = (
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

          if (docs.isDeprecated) {
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
