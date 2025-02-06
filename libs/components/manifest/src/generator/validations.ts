import type { SkyManifestParentDefinition } from '../types/base-def';
import { SkyManifestDocumentationConfig } from '../types/documentation-config';
import type { SkyManifestPublicApi } from '../types/manifest';

import { type PackagesMap } from './get-public-api';

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

export function validateDocumentationConfig(
  publicApi: SkyManifestPublicApi,
  config: SkyManifestDocumentationConfig,
): string[] {
  const errors: string[] = [];

  for (const configs of Object.values(config.packages)) {
    for (const [groupName, config] of Object.entries(configs.groups)) {
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
