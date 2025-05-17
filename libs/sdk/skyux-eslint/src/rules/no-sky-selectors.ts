import { ASTUtils, SelectorUtils, Selectors } from '@angular-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createESLintRule } from './utils/create-eslint-rule';

export const RULE_NAME = 'no-sky-selectors';
export const messageId = 'noSkySelectors';

const FORBIDDEN_PREFIXES = ['sky', 'skyux'];

export const rule = createESLintRule({
  create(context) {
    return {
      [Selectors.COMPONENT_CLASS_DECORATOR](node: TSESTree.Decorator): void {
        const rawSelectors = ASTUtils.getDecoratorPropertyValue(
          node,
          'selector',
        );

        if (!rawSelectors) {
          return;
        }

        const componentSelector = SelectorUtils.checkSelector(
          rawSelectors,
          'element',
          FORBIDDEN_PREFIXES,
          'kebab-case',
        );

        if (componentSelector?.hasExpectedPrefix) {
          context.report({
            loc: rawSelectors.loc,
            messageId,
          });
        }
      },
      [Selectors.DIRECTIVE_CLASS_DECORATOR](node: TSESTree.Decorator): void {
        const rawSelectors = ASTUtils.getDecoratorPropertyValue(
          node,
          'selector',
        );

        if (!rawSelectors) {
          return;
        }

        const directiveSelector = SelectorUtils.checkSelector(
          rawSelectors,
          'attribute',
          FORBIDDEN_PREFIXES,
          'camelCase',
        );

        if (directiveSelector?.hasExpectedPrefix) {
          context.report({
            loc: rawSelectors.loc,
            messageId,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Component and directive selectors must not start with "sky" to avoid naming collisions with SKY UX features.',
    },
    messages: {
      [messageId]: 'The selector must not start with "sky".',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
