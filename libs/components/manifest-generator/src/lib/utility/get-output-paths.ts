import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

export function getOutputPaths(outDir: string): {
  publicApiPath: string;
  documentationConfigPath: string;
  codeExamplesPath: string;
} {
  const publicApiPath = path.join(outDir, 'public-api.json');
  const documentationConfigPath = path.join(
    outDir,
    'documentation-config.json',
  );
  const codeExamplesPath = path.join(outDir, 'code-examples.json');

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
