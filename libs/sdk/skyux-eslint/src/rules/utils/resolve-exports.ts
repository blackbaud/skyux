import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import * as ts from 'typescript';

/**
 * Resolves a relative module specifier to an absolute file path.
 * Returns undefined if the file cannot be found.
 */
export function resolveModulePath(
  currentFilePath: string,
  moduleSpecifier: string,
): string | undefined {
  const dir = dirname(currentFilePath);
  const basePath = resolve(dir, moduleSpecifier);

  const candidates = [
    basePath + '.ts',
    basePath + '.tsx',
    basePath + '/index.ts',
    basePath + '/index.tsx',
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

export interface ExtractedNamedExports {
  valueExports: string[];
  typeExports: string[];
}

/**
 * Extracts named exports from a TypeScript file's content using the TypeScript
 * compiler API. Returns sorted, deduplicated arrays of value exports and
 * type-only exports.
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

  for (const statement of sourceFile.statements) {
    // ExportDeclaration: export { A, B }, export type { A }, export { type A, B }
    if (ts.isExportDeclaration(statement)) {
      if (
        statement.exportClause &&
        ts.isNamedExports(statement.exportClause)
      ) {
        for (const specifier of statement.exportClause.elements) {
          const name = specifier.name.text;
          if (statement.isTypeOnly || specifier.isTypeOnly) {
            typeExports.push(name);
          } else {
            valueExports.push(name);
          }
        }
      }
      continue;
    }

    // All other exported declarations need the export modifier.
    const modifiers = ts.getModifiers(statement as ts.HasModifiers) ?? [];
    if (
      !modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ||
      modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
    ) {
      continue;
    }

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
        if (ts.isIdentifier(decl.name)) {
          valueExports.push(decl.name.text);
        }
      }
    }
  }

  return {
    valueExports: [...new Set(valueExports)].sort(),
    typeExports: [...new Set(typeExports)].sort(),
  };
}

/**
 * Reads a file and extracts its named exports.
 * Returns undefined if the file cannot be read or has no named exports.
 */
export function getNamedExportsFromFile(
  filePath: string,
): ExtractedNamedExports | undefined {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const exports = extractNamedExports(content);
    const hasExports =
      exports.valueExports.length > 0 || exports.typeExports.length > 0;
    return hasExports ? exports : undefined;
  } catch {
    return undefined;
  }
}
