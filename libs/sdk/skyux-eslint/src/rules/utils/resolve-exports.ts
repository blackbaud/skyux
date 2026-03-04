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

/**
 * Extracts named exports from a TypeScript file's content using regex.
 * Returns a sorted, deduplicated array of export names.
 */
export function extractNamedExports(fileContent: string): string[] {
  const exports: string[] = [];

  // Match: export (abstract|async)? class|interface|type|function|const|let|var|enum <Name>
  const declarationRegex =
    /export\s+(?:(?:abstract|async|declare)\s+)*(?:class|interface|type|function|const|let|var|enum)\s+(\w+)/g;
  let match: RegExpExecArray | null;
  while ((match = declarationRegex.exec(fileContent)) !== null) {
    exports.push(match[1]);
  }

  // Match: export { A, B, C } or export { A as B } (with optional 'from')
  const namedExportRegex = /export\s*\{([^}]+)\}/g;
  while ((match = namedExportRegex.exec(fileContent)) !== null) {
    const names = match[1].split(',').map((name) => {
      const parts = name.trim().split(/\s+as\s+/);
      return parts[parts.length - 1].trim();
    });
    exports.push(...names.filter(Boolean));
  }

  return [...new Set(exports)].sort();
}

/**
 * Reads a file and extracts its named exports.
 * Returns undefined if the file cannot be read.
 */
export function getNamedExportsFromFile(
  filePath: string,
): string[] | undefined {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const exports = extractNamedExports(content);
    return exports.length > 0 ? exports : undefined;
  } catch {
    return undefined;
  }
}
