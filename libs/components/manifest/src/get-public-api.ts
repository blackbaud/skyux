import publicApiJson from '../public-api.json';

import type { SkyManifestPublicApi } from './types/manifest';

const publicApi = publicApiJson as unknown as SkyManifestPublicApi;

/**
 * Gets the public API from the manifest.
 * @internal
 */
export function getPublicApi(options?: {
  tags?: string[];
  excludeInternal?: boolean;
}): SkyManifestPublicApi {
  if (!options) {
    return publicApi;
  }

  const filteredApi: SkyManifestPublicApi = {
    packages: {},
  };

  const excludeInternal = options.excludeInternal;
  const tags = options.tags;

  if (tags && tags.length > 0) {
    for (const [packageName, packageDefinitions] of Object.entries(
      publicApi.packages,
    )) {
      let filteredPackageDefinitions = packageDefinitions.filter(
        (definition) => {
          if (definition.tags) {
            return definition.tags.some((tag) => tags.includes(tag));
          }

          return false;
        },
      );

      if (excludeInternal) {
        filteredPackageDefinitions = filteredPackageDefinitions.filter(
          (definition) => !definition.isInternal,
        );
      }

      if (filteredPackageDefinitions.length > 0) {
        filteredApi.packages[packageName] = filteredPackageDefinitions;
      }
    }
  }

  if (excludeInternal) {
    for (const [packageName, packageDefinitions] of Object.entries(
      publicApi.packages,
    )) {
      const filteredPackageDefinitions = packageDefinitions.filter(
        (definition) => !definition.isInternal,
      );

      if (filteredPackageDefinitions.length > 0) {
        filteredApi.packages[packageName] = filteredPackageDefinitions;
      }
    }
  }

  return filteredApi;
}
