import glob from 'fast-glob';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import type { SkyManifestDirectiveDefinition } from '../types/directive-def';
import type { SkyManifestDocumentationConfig } from '../types/documentation-config';
import type {
  SkyManifestCodeExampleFiles,
  SkyManifestCodeExamples,
  SkyManifestPublicApi,
} from '../types/manifest';

import { validateCodeExamples } from './validations';

export async function getCodeExamples(
  publicApi: SkyManifestPublicApi,
  documentationConfig: SkyManifestDocumentationConfig,
  codeExamplesPackageName: string,
): Promise<[SkyManifestCodeExamples, string[]]> {
  const definitions = publicApi.packages[
    codeExamplesPackageName
  ] as SkyManifestDirectiveDefinition[];

  const errors: string[] = [];

  const codeExamples: SkyManifestCodeExamples = {
    examples: {},
  };

  if (!definitions) {
    return [codeExamples, []];
  }

  // Scrape the contents of each file in the code example's directory.
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

    const selector = definition.selector;

    if (selector) {
      codeExamples.examples[definition.docsId] = {
        componentName: definition.name,
        demoHidden:
          definition.extraTags?.['docsDemoHidden'] !== undefined
            ? true
            : undefined,
        files,
        importPath: codeExamplesPackageName,
        primaryFile: path.basename(definition.filePath),
        selector,
        title: definition.extraTags?.['title'],
      };
    } else {
      errors.push(
        `The code example '${definition.docsId}' must specify a selector.`,
      );
    }
  }

  errors.push(
    ...validateCodeExamples(
      publicApi,
      documentationConfig,
      codeExamplesPackageName,
    ),
  );

  return [codeExamples, errors];
}
