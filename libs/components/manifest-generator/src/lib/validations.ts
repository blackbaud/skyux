import {
  SkyManifestDocumentationConfig,
  SkyManifestParentDefinition,
  SkyManifestPublicApi,
} from '@skyux/manifest-local';

import { type PackagesMap } from './get-public-api.js';

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

/**
 * Ensures all code examples are assigned to a documentation.json file.
 */
export function validateCodeExamples(
  publicApi: SkyManifestPublicApi,
  documentationConfig: SkyManifestDocumentationConfig,
  codeExamplesPackageName: string,
): string[] {
  const errors: string[] = [];
  const unreferencedIds: string[] = [];

  const codeExampleDocsIds = publicApi.packages[codeExamplesPackageName].map(
    (d) => d.docsId,
  );

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
      `The following code example docsIds are not being referenced within a documentation.json file. Either delete the code example, or add its docsId to a documentation.json file: "${unreferencedIds.join('", "')}"`,
    );
  }

  return errors;
}
