import type { TSESTree } from '@typescript-eslint/utils';

import { createESLintRule } from './utils/create-eslint-rule';

export const RULE_NAME = 'no-lambda-imports';
export const messageId = 'noLambdaImports';

export const rule = createESLintRule({
  create(context) {
    return {
      ['ImportDeclaration'](node: TSESTree.ImportDeclaration): void {
        const lambdaImports = node.specifiers.filter((specifier) => {
          return specifier.local.name.startsWith('λ');
        });

        if (lambdaImports.length > 0) {
          for (const lambdaImport of lambdaImports) {
            const data = {
              importName: lambdaImport.local.name,
            };

            context.report({
              loc: lambdaImport.loc,
              messageId,
              data,
            });
          }
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Prevents importing components from SKY UX packages that start with the "λ" lambda character.',
    },
    messages: {
      [messageId]: '{{importName}} is not included in the SKY UX public API',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
