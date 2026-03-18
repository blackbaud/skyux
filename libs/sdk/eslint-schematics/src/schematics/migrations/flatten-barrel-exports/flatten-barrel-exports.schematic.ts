import type { Rule } from '@angular-devkit/schematics';

import {
  type WildcardReExport,
  buildNamedExportStatement,
  extractNamedExports,
  findWildcardReExports,
  resolveInTree,
  topologicalSort,
} from './barrel-export-utils';

export default function flattenBarrelExports(): Rule {
  return (tree, context) => {
    // 1. Scan all .ts files for wildcard re-exports.
    const filesWithWildcards = new Map<string, WildcardReExport[]>();

    tree.visit((filePath) => {
      if (!filePath.endsWith('.ts') || filePath.includes('node_modules')) {
        return;
      }

      const content = tree.readText(filePath);
      const wildcards = findWildcardReExports(content);

      if (wildcards.length > 0) {
        filesWithWildcards.set(filePath, wildcards);
      }
    });

    if (filesWithWildcards.size === 0) {
      context.logger.info(
        'No barrel exports (export * from) found. Nothing to do.',
      );
      return;
    }

    context.logger.info(
      `Found ${filesWithWildcards.size} file(s) with barrel exports.`,
    );

    // 2. Build dependency graph and topologically sort (leaf-first).
    const graph = new Map<string, string[]>();

    for (const [filePath, wildcards] of filesWithWildcards) {
      const deps: string[] = [];

      for (const wc of wildcards) {
        const resolved = resolveInTree(tree, filePath, wc.specifier);

        if (resolved && filesWithWildcards.has(resolved)) {
          deps.push(resolved);
        }
      }

      graph.set(filePath, deps);
    }

    const sorted = topologicalSort(graph);

    // 3. Process each file in leaf-first order.
    let fixedCount = 0;

    for (const filePath of sorted) {
      const content = tree.readText(filePath);
      const wildcards = findWildcardReExports(content);

      // Process replacements from end to start to preserve character offsets.
      const sortedByPos = [...wildcards].sort((a, b) => b.start - a.start);
      let updated = content;

      for (const wc of sortedByPos) {
        const resolved = resolveInTree(tree, filePath, wc.specifier);

        if (!resolved) {
          continue;
        }

        const targetContent = tree.readText(resolved);
        const targetExports = extractNamedExports(targetContent);

        // Skip if target still has unresolved wildcards.
        if (targetExports.hasWildcardReExports) {
          continue;
        }

        if (
          targetExports.valueExports.length === 0 &&
          targetExports.typeExports.length === 0
        ) {
          continue;
        }

        const replacement = buildNamedExportStatement(
          targetExports,
          wc.specifier,
        );
        updated =
          updated.slice(0, wc.start) + replacement + updated.slice(wc.end);
      }

      if (updated !== content) {
        tree.overwrite(filePath, updated);
        fixedCount++;
        context.logger.info(`Flattened barrel exports in ${filePath}`);
      }
    }

    context.logger.info(
      `Done. Flattened barrel exports in ${fixedCount} file(s).`,
    );
  };
}
