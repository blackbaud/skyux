import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

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
 * Extracts named exports from a TypeScript file's content using regex.
 * Returns sorted, deduplicated arrays of value exports and type-only exports.
 */
export function extractNamedExports(
  fileContent: string,
): ExtractedNamedExports {
  const valueExports: string[] = [];
  const typeExports: string[] = [];

  // Match value declarations: class (including abstract), function (including async), enum
  const valueDeclarationRegex =
    /export\s+(?:(?:abstract|async|declare)\s+)*(?:class|function|enum)\s+(\w+)/g;
  let match: RegExpExecArray | null;
  while ((match = valueDeclarationRegex.exec(fileContent)) !== null) {
    valueExports.push(match[1]);
  }

  // Match type-only declarations: interface, type alias
  const typeDeclarationRegex =
    /export\s+(?:declare\s+)*(?:interface|type)\s+(\w+)/g;
  while ((match = typeDeclarationRegex.exec(fileContent)) !== null) {
    typeExports.push(match[1]);
  }

  // Match variable declarations (const/let/var), including multi-declarator
  // e.g. export const a = 1, b = 2;
  const variableDeclarationRegex =
    /export\s+(?:declare\s+)?(?:const|let|var)\s+([^;\n]+)/g;
  while ((match = variableDeclarationRegex.exec(fileContent)) !== null) {
    const names = match[1]
      .split(',')
      .map((segment) => segment.trim().match(/^([A-Za-z_$][\w$]*)/)?.[1])
      .filter((name): name is string => Boolean(name));
    valueExports.push(...names);
  }

  // Match type-only named re-exports: export type { A, B as C } (with optional 'from')
  const namedTypeExportRegex = /export\s+type\s*\{([^}]+)\}/g;
  while ((match = namedTypeExportRegex.exec(fileContent)) !== null) {
    const names = match[1].split(',').map((name) => {
      const parts = name.trim().split(/\s+as\s+/);
      return parts[parts.length - 1].trim();
    });
    typeExports.push(...names.filter(Boolean));
  }

  // Match value named re-exports: export { A, B } (with optional 'from')
  // Also handles inline type modifier: export { type Foo, Bar }
  // Note: export\s*\{ does not match "export type {" since "type" intervenes before "{"
  const namedValueExportRegex = /export\s*\{([^}]+)\}/g;
  while ((match = namedValueExportRegex.exec(fileContent)) !== null) {
    const specifiers = match[1].split(',');
    for (const specifier of specifiers) {
      const cleaned = specifier.trim();
      if (!cleaned) {
        continue;
      }

      const isTypeSpecifier = /^type\s+/.test(cleaned);
      const withoutType = isTypeSpecifier
        ? cleaned.replace(/^type\s+/, '')
        : cleaned;
      const parts = withoutType.split(/\s+as\s+/);
      const exportedName = parts[parts.length - 1].trim();

      if (isTypeSpecifier) {
        typeExports.push(exportedName);
      } else {
        valueExports.push(exportedName);
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
