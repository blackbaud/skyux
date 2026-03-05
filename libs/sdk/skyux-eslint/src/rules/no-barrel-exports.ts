import type { TSESTree } from '@typescript-eslint/utils';

import { isAbsolute } from 'node:path';

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
              // Skip fix when linting from stdin — context.filename is not a
              // real file path, so relative module resolution is unreliable.
              !isAbsolute(context.filename) ||
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

            const parts: string[] = [];

            if (namedExports.valueExports.length > 0) {
              parts.push(
                `export { ${namedExports.valueExports.join(', ')} } from '${moduleSpecifier}';`,
              );
            }

            if (namedExports.typeExports.length > 0) {
              parts.push(
                `export type { ${namedExports.typeExports.join(', ')} } from '${moduleSpecifier}';`,
              );
            }

            return fixer.replaceText(node, parts.join('\n'));
          },
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Prevents wildcard (`export * from`) and namespace (`export * as ns from`) re-exports to ensure explicit public API surfaces.',
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
