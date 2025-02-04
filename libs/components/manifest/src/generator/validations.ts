import Ajv from 'ajv';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import documentationSchema from '../../documentation-schema.json';
import type { SkyManifestParentDefinition } from '../types/base-def';
import { SkyManifestPublicApi } from '../types/manifest';

import { ProjectDefinition } from './get-project-definitions';
import { type PackagesMap } from './get-public-api';

const ajv = new Ajv();
const validateJson = ajv.compile(documentationSchema);

function getDefinitionByDocsId(
  docsId: string,
  publicApi: SkyManifestPublicApi,
): SkyManifestParentDefinition | undefined {
  for (const definitions of Object.values(publicApi.packages)) {
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
  publicApi: SkyManifestPublicApi,
  projects: ProjectDefinition[],
): Promise<string[]> {
  const errors: string[] = [];

  for (const project of projects) {
    const documentationJsonPath = path.join(
      project.projectRoot,
      'documentation.json',
    );

    if (!fs.existsSync(documentationJsonPath)) {
      continue;
    }

    const config = JSON.parse(
      await fsPromises.readFile(path.normalize(documentationJsonPath), {
        encoding: 'utf-8',
      }),
    );

    if (!validateJson(config)) {
      errors.push(`Schema validation failed for ${documentationJsonPath}`);
      continue;
    }

    const groups = config['groups'] as Record<
      string,
      { docsIds: string[]; primaryDocsId: string }
    >;

    for (const [groupName, config] of Object.entries(groups)) {
      for (const docsId of config.docsIds) {
        const definition = getDefinitionByDocsId(docsId, publicApi);

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
