import { SkyManifestParentDefinition } from './base-def';

/**
 * Information about the SKY UX public API.
 */
export interface SkyManifestPublicApi {
  packages: Record<string, SkyManifestParentDefinition[]>;
}
