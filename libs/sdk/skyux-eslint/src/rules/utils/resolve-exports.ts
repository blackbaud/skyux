import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import * as ts from 'typescript';

const tsconfigCache = new Map<string, string | undefined>();

/**
 * Finds the baseUrl from the nearest tsconfig.json.
 * Caches results per directory to avoid repeated filesystem walks.
 */
function findBaseUrl(fromDir: string): string | undefined {
  if (tsconfigCache.has(fromDir)) {
    return tsconfigCache.get(fromDir);
  }

  const configPath = ts.findConfigFile(
    fromDir,
    ts.sys.fileExists,
    'tsconfig.json',
  );

  if (!configPath) {
    tsconfigCache.set(fromDir, undefined);
    return undefined;
  }

  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  const rawBaseUrl = config?.compilerOptions?.baseUrl;
  const baseUrl = rawBaseUrl
    ? resolve(dirname(configPath), rawBaseUrl)
    : undefined;

  tsconfigCache.set(fromDir, baseUrl);
  return baseUrl;
}

function tryResolve(basePath: string): string | undefined {
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

/**
 * Resolves a module specifier to an absolute file path.
 * Handles relative specifiers (./foo) and bare specifiers (src/foo)
 * resolved via the nearest tsconfig.json baseUrl.
 * Returns undefined if the file cannot be found.
 */
export function resolveModulePath(
  currentFilePath: string,
  moduleSpecifier: string,
): string | undefined {
  const dir = dirname(currentFilePath);

  if (moduleSpecifier.startsWith('.')) {
    return tryResolve(resolve(dir, moduleSpecifier));
  }

  const baseUrl = findBaseUrl(dir);
  if (baseUrl) {
    return tryResolve(resolve(baseUrl, moduleSpecifier));
  }

  return undefined;
}

/**
 * Clears the tsconfig baseUrl cache. Exported for testing.
 */
export function resetResolveCache(): void {
  tsconfigCache.clear();
}

export interface ExtractedNamedExports {
  valueExports: string[];
  typeExports: string[];
  hasWildcardReExports: boolean;
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
  let hasWildcardReExports = false;

  for (const statement of sourceFile.statements) {
    // ExportDeclaration: export { A, B }, export type { A }, export { type A, B }
    if (ts.isExportDeclaration(statement)) {
      if (!statement.exportClause) {
        // export * from '...' — bare wildcard re-export
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

    // All other exported declarations need the export modifier.
    // All top-level statements support modifiers in the TypeScript AST.
    // We skip `ts.canHaveModifiers()` because it's always true here and
    // creates an unreachable branch that breaks 100% coverage.
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

  const valueSet = new Set(valueExports);

  return {
    valueExports: [...valueSet].sort(),
    typeExports: [...new Set(typeExports)]
      .filter((name) => !valueSet.has(name))
      .sort(),
    hasWildcardReExports,
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
