import publicApiJson from '../public-api.json';

import type { SkyManifestPublicApi } from './types/manifest';

const publicApi = publicApiJson as unknown as SkyManifestPublicApi;

function applyPublicApi(
  target: SkyManifestPublicApi,
  overrides: SkyManifestPublicApi,
): void {
  for (const [packageName, packageDefinitions] of Object.entries(
    overrides.packages,
  )) {
    target.packages[packageName] ??= [];

    for (const definition of packageDefinitions) {
      target.packages[packageName].push(definition);
    }
  }
}

/**
 * Gets the public API associated with a specific docs ID.
 * @internal
 */
export function getPublicApiByDocsId(
  docsId: string,
): SkyManifestPublicApi | undefined {
  const filteredApi: SkyManifestPublicApi = {
    packages: {},
  };

  for (const [packageName, packageDefinitions] of Object.entries(
    publicApi.packages,
  )) {
    const entryPoint = packageDefinitions.find((definition) => {
      return definition.docsId === docsId;
    });

    if (entryPoint && !entryPoint.isInternal) {
      filteredApi.packages[packageName] = [entryPoint];

      if (entryPoint.docsIncludeIds) {
        for (const docsIncludeId of entryPoint.docsIncludeIds) {
          const otherDefinition = getPublicApiByDocsId(docsIncludeId);
          if (otherDefinition) {
            applyPublicApi(filteredApi, otherDefinition);
          }
        }
      }
    }
  }

  if (Object.keys(filteredApi.packages).length === 0) {
    return undefined;
  }

  return filteredApi;
}

/**
 * Gets the public API from the manifest.
 * @internal
 */
export function getPublicApi(): SkyManifestPublicApi {
  return publicApi;
}
