import publicApiJson from '../public-api.json';

import type { SkyManifestPublicApi } from './types/manifest';

const publicApi = publicApiJson as unknown as SkyManifestPublicApi;

/**
 * Gets the public API from the manifest.
 * @internal
 */
export function getPublicApi(): SkyManifestPublicApi {
  return publicApi;
}
