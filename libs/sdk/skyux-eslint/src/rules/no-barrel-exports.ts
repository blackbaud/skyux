import type { TSESTree } from '@typescript-eslint/utils';

import { createESLintRule } from './utils/create-eslint-rule';
import {
  getNamedExportsFromFile,
  resolveModulePath,
} from './utils/resolve-exports';

export const RULE_NAME = 'no-barrel-exports';
export const messageId = 'noBarrelExports';
export const namespaceMessageId = 'noNamespaceReExports';

export const rule = createESLintRule({
  create(context) {
    return {
      ['ExportAllDeclaration'](node: TSESTree.ExportAllDeclaration): void {
        if (node.exported) {
          // export * as ns from '...'
          context.report({
            node,
            messageId: namespaceMessageId,
            data: {
              namespace: node.exported.name,
            },
          });
          return;
        }

        // export * from '...'
        const moduleSpecifier = node.source.value;

        context.report({
          node,
          messageId,
          fix(fixer) {
            if (
              typeof moduleSpecifier !== 'string' ||
              !moduleSpecifier.startsWith('.')
            ) {
              return null;
            }

            const resolvedPath = resolveModulePath(
              context.filename,
              moduleSpecifier,
            );

            if (!resolvedPath) {
              return null;
            }

            const namedExports = getNamedExportsFromFile(resolvedPath);

            if (!namedExports) {
              return null;
            }

            return fixer.replaceText(
              node,
              `export { ${namedExports.join(', ')} } from '${moduleSpecifier}';`,
            );
          },
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Prevents wildcard re-exports (`export * from`) to ensure explicit public API surfaces.',
    },
    fixable: 'code',
    messages: {
      [messageId]:
        "Avoid wildcard re-exports. Use explicit named exports instead (e.g., `export { A, B } from './foo'`).",
      [namespaceMessageId]:
        'Avoid namespace re-exports (`export * as {{namespace}}`). Use explicit named exports instead.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
