import glob from 'fast-glob';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { SkyManifestDocumentationConfig } from '../types/documentation-config';
import type {
  SkyManifestCodeExampleFiles,
  SkyManifestCodeExamples,
  SkyManifestPublicApi,
} from '../types/manifest';

import { validateCodeExamples } from './validations';

export async function getCodeExamples(
  publicApi: SkyManifestPublicApi,
  documentationConfig: SkyManifestDocumentationConfig,
): Promise<[SkyManifestCodeExamples, string[]]> {
  const definitions = publicApi.packages['@skyux/code-examples'];

  const codeExamples: SkyManifestCodeExamples = {
    examples: {},
  };

  if (!definitions) {
    return [codeExamples, []];
  }

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
      title: definition.extraTags?.['title'],
    };
  }

  const errors = validateCodeExamples(publicApi, documentationConfig);

  return [codeExamples, errors];
}
