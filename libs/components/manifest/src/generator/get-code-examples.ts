import glob from 'fast-glob';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { SkyManifestDocumentationConfig } from '../types/documentation-config';
import type {
  SkyManifestCodeExampleFiles,
  SkyManifestCodeExamples,
  SkyManifestPublicApi,
} from '../types/manifest';

/**
 * Ensures all code examples are assigned to a documentation.json file.
 */
function validateCodeExamples(
  publicApi: SkyManifestPublicApi,
  documentationConfig: SkyManifestDocumentationConfig,
): string[] {
  const errors: string[] = [];

  const codeExampleDocsIds = publicApi.packages['@skyux/code-examples'].map(
    (d) => d.docsId,
  );
  const unreferencedIds: string[] = [];

  for (const docsId of codeExampleDocsIds) {
    let found = false;

    for (const configs of Object.values(documentationConfig.packages)) {
      for (const group of Object.values(configs.groups)) {
        if (group.docsIds.includes(docsId)) {
          found = true;
        }
      }
    }

    if (!found) {
      unreferencedIds.push(docsId);
    }
  }

  if (unreferencedIds.length > 0) {
    errors.push(
      `The following code examples are not being referenced within a documentation.json file. Either delete the code example, or add it to a documentation.json file.\n - ${unreferencedIds.join('\n - ')}`,
    );
  }

  return errors;
}

export async function getCodeExamples(
  publicApi: SkyManifestPublicApi,
  documentationConfig: SkyManifestDocumentationConfig,
): Promise<SkyManifestCodeExamples> {
  const definitions = publicApi.packages['@skyux/code-examples'];

  const codeExamples: SkyManifestCodeExamples = {
    examples: {},
  };

  if (!definitions) {
    return codeExamples;
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
    };
  }

  const errors = validateCodeExamples(publicApi, documentationConfig);

  if (errors.length > 0) {
    throw new Error(
      'Encountered the following errors when generating code examples:\n - ' +
        errors.join('\n - '),
    );
  }

  // todo: throw error if unused example found.
  // todo: add support for @title
  // todo: try getting it to work locally

  return codeExamples;
}
