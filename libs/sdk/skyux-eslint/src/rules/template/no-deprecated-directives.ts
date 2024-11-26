import {
  type TmplAstBoundAttribute,
  type TmplAstElement,
  type TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';
import { type SkyManifestPublicApi } from '@skyux/manifest';
import publicApi from '@skyux/manifest/public-api.json';
import { type RuleListener } from '@typescript-eslint/utils/ts-eslint';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

import { getDeprecatedTemplateFeatures } from './utils/get-deprecated-template-features';
import { getDirectiveSelectorDetails } from './utils/get-directive-selector-details';
import { DeprecatedDirective } from './utils/types';

const DEPRECATIONS = getDeprecatedTemplateFeatures(
  publicApi as SkyManifestPublicApi,
);

export const RULE_NAME = 'no-deprecated-directives';

export const rule = createESLintTemplateRule({
  create(context) {
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
      const details = getDirectiveSelectorDetails(DEPRECATIONS.directives);

      for (const detail of details) {
        const ruleId = detail.elementName
          ? `Element$1[name=${detail.elementName}] > :matches(BoundAttribute, TextAttribute)[name="${detail.templateBindingName}"]`
          : `:matches(BoundAttribute, TextAttribute)[name="${detail.templateBindingName}"]`;

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
