import type { TSESTree } from '@typescript-eslint/utils';

import { createESLintRule } from '../utils/create-eslint-rule';

export const RULE_NAME = 'no-lambda-imports';

export const noLambdaImports = createESLintRule({
  create(context) {
    return {
      ['ImportDeclaration'](node: TSESTree.ImportDeclaration) {
        const found = node.specifiers.find((specifier) => {
          return specifier.local.name.startsWith('λ');
        });

        if (found) {
          context.report({
            loc: found.loc,
            messageId: 'noLambdaImports',
            data: {},
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Do not import lambdas.',
    },
    messages: {
      noLambdaImports: 'Do not import lambda files.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
