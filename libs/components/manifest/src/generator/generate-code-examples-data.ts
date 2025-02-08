import glob from 'fast-glob';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { SkyManifestPublicApi } from '../types/manifest';

interface CodeExample {
  files: Record<string, string>;
  importPath: string;
  primaryFile: string;
  title?: string;
}

const OUTPUT_PATH = path.normalize(
  'dist/libs/components/code-examples/code-examples.json',
);

async function createJsonFile(
  codeExamples: Record<string, CodeExample>,
): Promise<void> {
  await fsPromises.writeFile(
    OUTPUT_PATH,
    JSON.stringify(codeExamples, undefined, 2),
    { encoding: 'utf-8' },
  );
}

export async function generateCodeExamplesData(
  publicApi: SkyManifestPublicApi,
): Promise<void> {
  const definitions = publicApi.packages['@skyux/code-examples'];

  const codeExamples: Record<string, CodeExample> = {};

  if (definitions) {
    // Scrape the contents of each file in the code example's directory.
    for (const definition of definitions) {
      const rootPath = path.dirname(definition.filePath);
      const rootPathResolved = `${glob.convertPathToPattern(rootPath)}/`;

      const filePaths = await glob(rootPathResolved + '**/*');
      const files: Record<string, string> = {};

      for (const filePath of filePaths) {
        const fileName = filePath.replace(rootPathResolved, '');
        files[fileName] = await fsPromises.readFile(filePath, {
          encoding: 'utf-8',
        });
      }

      codeExamples[definition.name] = {
        files,
        importPath: '@skyux/code-examples',
        primaryFile: path.basename(definition.filePath),
        title: definition.extraTags?.['title'],
      };
    }
  }

  await createJsonFile(codeExamples);
}
