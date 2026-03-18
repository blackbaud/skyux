import type { Tree } from '@angular-devkit/schematics';

import { dirname, resolve } from 'node:path/posix';
import * as ts from 'typescript';

export interface ExtractedNamedExports {
  valueExports: string[];
  typeExports: string[];
  hasWildcardReExports: boolean;
}

/**
 * Extracts named exports from TypeScript source text using the compiler API.
 * Returns sorted, deduplicated arrays of value and type exports, plus a flag
 * indicating whether the file contains any `export * from` re-exports.
 */
export function extractNamedExports(
  fileContent: string,
): ExtractedNamedExports {
  const sourceFile = ts.createSourceFile(
    'file.ts',
    fileContent,
    ts.ScriptTarget.Latest,
    false,
  );

  const valueExports: string[] = [];
  const typeExports: string[] = [];
  let hasWildcardReExports = false;

  for (const statement of sourceFile.statements) {
    if (ts.isExportDeclaration(statement)) {
      if (!statement.exportClause) {
        // export * from '...'
        hasWildcardReExports = true;
      } else if (ts.isNamedExports(statement.exportClause)) {
        for (const specifier of statement.exportClause.elements) {
          const name = specifier.name.text;
          if (statement.isTypeOnly || specifier.isTypeOnly) {
            typeExports.push(name);
          } else {
            valueExports.push(name);
          }
        }
      } else if (ts.isNamespaceExport(statement.exportClause)) {
        // export * as ns from '...' — the namespace name is a value export
        valueExports.push(statement.exportClause.name.text);
      }
      continue;
    }

    const modifiers = ts.getModifiers(statement as ts.HasModifiers) ?? [];
    if (
      !modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ||
      modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
    ) {
      continue;
    }

    /* istanbul ignore else */
    if (ts.isClassDeclaration(statement) && statement.name) {
      valueExports.push(statement.name.text);
    } else if (ts.isFunctionDeclaration(statement) && statement.name) {
      valueExports.push(statement.name.text);
    } else if (ts.isEnumDeclaration(statement)) {
      valueExports.push(statement.name.text);
    } else if (ts.isInterfaceDeclaration(statement)) {
      typeExports.push(statement.name.text);
    } else if (ts.isTypeAliasDeclaration(statement)) {
      typeExports.push(statement.name.text);
    } else if (ts.isVariableStatement(statement)) {
      for (const decl of statement.declarationList.declarations) {
        /* istanbul ignore else */
        if (ts.isIdentifier(decl.name)) {
          valueExports.push(decl.name.text);
        }
      }
    }
  }

  const valueSet = new Set(valueExports);

  return {
    valueExports: [...valueSet].sort(),
    typeExports: [...new Set(typeExports)]
      .filter((name) => !valueSet.has(name))
      .sort(),
    hasWildcardReExports,
  };
}

export interface WildcardReExport {
  /** The module specifier (e.g., './foo'). */
  specifier: string;
  /** Start offset of the `export * from '...'` statement in the source. */
  start: number;
  /** End offset of the statement text (including trailing semicolon if present). */
  end: number;
}

/**
 * Finds all bare `export * from '...'` statements in a file.
 * Excludes `export * as ns from '...'` (namespace re-exports).
 */
export function findWildcardReExports(content: string): WildcardReExport[] {
  const sourceFile = ts.createSourceFile(
    'file.ts',
    content,
    ts.ScriptTarget.Latest,
    false,
  );

  const results: WildcardReExport[] = [];

  for (const statement of sourceFile.statements) {
    if (
      ts.isExportDeclaration(statement) &&
      !statement.exportClause &&
      !statement.isTypeOnly &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      results.push({
        specifier: statement.moduleSpecifier.text,
        start: statement.getStart(sourceFile),
        end: statement.getEnd(),
      });
    }
  }

  return results;
}

/**
 * Resolves a relative module specifier to a file path within the Tree.
 * Tries .ts, .tsx, /index.ts, /index.tsx extensions.
 * Only handles relative specifiers (starting with '.').
 */
export function resolveInTree(
  tree: Tree,
  fromFilePath: string,
  specifier: string,
): string | undefined {
  if (!specifier.startsWith('.')) {
    return undefined;
  }

  const dir = dirname(fromFilePath);
  const basePath = resolve(dir, specifier);

  const candidates = [
    basePath + '.ts',
    basePath + '.tsx',
    basePath + '/index.ts',
    basePath + '/index.tsx',
  ];

  for (const candidate of candidates) {
    if (tree.exists(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

/**
 * Builds explicit named export statement(s) from extracted exports.
 */
export function buildNamedExportStatement(
  namedExports: ExtractedNamedExports,
  specifier: string,
): string {
  const parts: string[] = [];

  if (namedExports.valueExports.length > 0) {
    parts.push(
      `export { ${namedExports.valueExports.join(', ')} } from '${specifier}';`,
    );
  }

  if (namedExports.typeExports.length > 0) {
    parts.push(
      `export type { ${namedExports.typeExports.join(', ')} } from '${specifier}';`,
    );
  }

  return parts.join('\n');
}

/**
 * Topological sort using Kahn's algorithm.
 * Returns nodes in leaf-first order (nodes with no dependencies first).
 */
export function topologicalSort(graph: Map<string, string[]>): string[] {
  const queue: string[] = [];
  const outDegree = new Map<string, number>();

  for (const [node, deps] of graph) {
    outDegree.set(node, deps.length);
    if (deps.length === 0) {
      queue.push(node);
    }
  }

  const sorted: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    sorted.push(node);

    for (const [other, deps] of graph) {
      if (deps.includes(node)) {
        const newDeg = outDegree.get(other)! - 1;
        outDegree.set(other, newDeg);
        if (newDeg === 0) {
          queue.push(other);
        }
      }
    }
  }

  // Any remaining nodes are in cycles — append them at the end.
  for (const node of graph.keys()) {
    if (!sorted.includes(node)) {
      sorted.push(node);
    }
  }

  return sorted;
}
