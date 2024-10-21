import {
  type TmplAstBoundAttribute,
  type TmplAstElement,
  type TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';
import { RuleListener } from '@typescript-eslint/utils/ts-eslint';

import deprecationsJson from '../../__deprecations.json';
import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

const DEPRECATIONS = deprecationsJson as Deprecations;

interface DeprecatedProperty {
  reason?: string;
}

type DeprecatedProperties = Record<string, DeprecatedProperty>;

interface DeprecatedDirective {
  deprecated: boolean;
  reason?: string;
  properties?: DeprecatedProperties;
}

interface Deprecations {
  components?: Record<string, DeprecatedDirective>;
  directives?: Record<string, DeprecatedDirective>;
}

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
        for (const [propertyName, propertyDetails] of Object.entries(
          docs.properties,
        )) {
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
                reason: propertyDetails.reason ?? '',
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

      rules[`Element$1[name=/^(${selectors})$/]`] = (el: TmplAstElement) => {
        const docs = components[el.name];

        if (docs.deprecated) {
          reportDeprecatedDirective(el, docs);
        } else {
          reportDeprecatedInputsOutputs(el, docs);
        }
      };
    }

    if (DEPRECATIONS.directives !== undefined) {
      const directives = DEPRECATIONS.directives;
      const selectors = Object.keys(directives).join('|');

      rules[
        `:matches(BoundAttribute, TextAttribute)[name=/^(${selectors})$/]`
      ] = (
        el: (TmplAstBoundAttribute | TmplAstTextAttribute) & {
          parent: TmplAstElement;
        },
      ) => {
        const docs = directives[el.name];

        if (docs.deprecated) {
          reportDeprecatedDirective(el, docs);
        } else {
          reportDeprecatedInputsOutputs(el.parent, docs);
        }
      };
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
