import glob from 'fast-glob';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import type {
  SkyManifestCodeExampleFiles,
  SkyManifestCodeExamples,
  SkyManifestPublicApi,
} from '../types/manifest';

export async function getCodeExamples(
  publicApi: SkyManifestPublicApi,
): Promise<SkyManifestCodeExamples> {
  const definitions = publicApi.packages['@skyux/code-examples'];

  const codeExamples: SkyManifestCodeExamples = {
    examples: {},
  };

  for (const definition of definitions) {
    const rootPath = path.dirname(definition.filePath);
    const rootPathResolved = `${glob.convertPathToPattern(rootPath)}/`;

    const filePaths = await glob(rootPathResolved + '**/*');
    const files: SkyManifestCodeExampleFiles = {};

    for (const filePath of filePaths) {
      const fileName = filePath.replace(rootPathResolved, '');
      files[fileName] = await fsPromises.readFile(filePath, {
        encoding: 'utf-8',
      });
    }

    codeExamples.examples[definition.docsId] = {
      files,
      primaryFile: path.basename(definition.filePath),
    };
  }

  return codeExamples;
}
