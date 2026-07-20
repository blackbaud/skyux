import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

/**
 * Normalizes a path to use forward slashes so generated manifest output is
 * consistent across operating systems (Node's fs APIs accept forward
 * slashes on Windows, so this doesn't affect actual file operations).
 */
export function normalizeToPosixPath(value: string): string {
  return path.normalize(value).split(path.sep).join('/');
}

export function getOutputPaths(outDir: string): {
  publicApiPath: string;
  documentationConfigPath: string;
  codeExamplesPath: string;
} {
  const publicApiPath = path.posix.join(outDir, 'public-api.json');
  const documentationConfigPath = path.posix.join(
    outDir,
    'documentation-config.json',
  );
  const codeExamplesPath = path.posix.join(outDir, 'code-examples.json');

  return {
    publicApiPath,
    documentationConfigPath,
    codeExamplesPath,
  };
}

export async function ensureDirectory(directoryPath: string): Promise<void> {
  /* v8 ignore else -- @preserve */
  if (!fs.existsSync(directoryPath)) {
    await fsPromises.mkdir(directoryPath);
  }
}
