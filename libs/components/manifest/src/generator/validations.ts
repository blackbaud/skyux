import Ajv from 'ajv';
import glob from 'fast-glob';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import documentationSchema from '../../documentation-schema.json';
import type { SkyManifestParentDefinition } from '../types/base-def';

import { type PackagesMap } from './get-public-api';

const ajv = new Ajv();
const validateJson = ajv.compile(documentationSchema);

function getDefinitionByDocsId(
  docsId: string,
  packages: PackagesMap,
): SkyManifestParentDefinition | undefined {
  for (const [, definitions] of packages) {
    for (const definition of definitions) {
      if (definition.docsId === docsId) {
        return definition;
      }
    }
  }

  return;
}

export function validateDocsIds(packages: PackagesMap): string[] {
  const errors: string[] = [];
  const ids: string[] = [];

  for (const [, definitions] of packages) {
    for (const definition of definitions) {
      if (ids.includes(definition.docsId)) {
        errors.push(`Duplicate @docsId encountered: ${definition.docsId}`);
        continue;
      }

      ids.push(definition.docsId);
    }
  }

  return errors;
}

export async function validateDocumentationConfigs(
  packages: PackagesMap,
): Promise<string[]> {
  const errors: string[] = [];
  const documentationConfigs = await glob(
    'libs/components/**/documentation.json',
  );

  for (const configFile of documentationConfigs) {
    const contents = JSON.parse(
      await fsPromises.readFile(path.normalize(configFile), {
        encoding: 'utf-8',
      }),
    );

    if (!validateJson(contents)) {
      errors.push(`Schema validation failed for ${configFile}`);
      continue;
    }

    const groups = contents['groups'] as Record<
      string,
      { docsIds: string[]; primaryDocsId: string }
    >;

    for (const [groupName, config] of Object.entries(groups)) {
      for (const docsId of config.docsIds) {
        const definition = getDefinitionByDocsId(docsId, packages);

        if (!definition) {
          errors.push(
            `The @docsId "${docsId}" referenced by "${groupName}" is not recognized.`,
          );
          continue;
        }

        if (definition.isInternal) {
          errors.push(
            `The @docsId "${docsId}" referenced by "${groupName}" is not included in the public API.`,
          );
          continue;
        }
      }

      if (!config.docsIds.includes(config.primaryDocsId)) {
        errors.push(
          `The value for primaryDocsId ("${config.primaryDocsId}") must be included in the docsIds array for group "${groupName}" (current: ${config.docsIds.join(', ')}).`,
        );
        continue;
      }
    }
  }

  return errors;
}
