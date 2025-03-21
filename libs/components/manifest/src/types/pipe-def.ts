import type { SkyManifestParentDefinition } from './base-def.js';
import type {
  SkyManifestClassMethodDefinition,
  SkyManifestClassPropertyDefinition,
} from './class-def.js';

/**
 * Information about a pipe exported from the public API.
 * @internal
 */
export interface SkyManifestPipeDefinition extends SkyManifestParentDefinition {
  children: (
    | SkyManifestClassMethodDefinition
    | SkyManifestClassPropertyDefinition
  )[];
  kind: 'pipe';
  templateBindingName: string;
}
