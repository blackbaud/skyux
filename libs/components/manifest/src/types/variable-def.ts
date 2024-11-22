import type { SkyManifestParentDefinition } from './base-def';

/**
 * Information about a variable exported from the public API.
 */
export interface SkyManifestVariableDefinition
  extends SkyManifestParentDefinition {
  kind: 'variable';
  type: string;
}
