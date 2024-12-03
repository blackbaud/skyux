import publicApi from '../public-api.json';

import type { SkyManifestPublicApi } from './types/manifest';

/**
 * Gets the public API from the manifest.
 */
export function getPublicApi(): SkyManifestPublicApi {
  return publicApi as SkyManifestPublicApi;
}
