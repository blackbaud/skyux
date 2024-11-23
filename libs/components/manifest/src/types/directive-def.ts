import type {
  SkyManifestChildDefinition,
  SkyManifestParentDefinition,
} from './base-def';

/**
 * Information about a directive or component exported from the public API.
 */
export interface SkyManifestDirectiveDefinition
  extends SkyManifestParentDefinition {
  children?: (
    | SkyManifestDirectiveInputDefinition
    | SkyManifestDirectiveOutputDefinition
  )[];
  selector?: string;
  kind: 'directive' | 'component';
}

/**
 * Information about a directive input property.
 */
export interface SkyManifestDirectiveInputDefinition
  extends SkyManifestChildDefinition {
  defaultValue?: string;
  isRequired?: boolean;
  kind: 'directive-input';
}

/**
 * Information about a directive input property.
 */
export interface SkyManifestDirectiveOutputDefinition
  extends SkyManifestChildDefinition {
  kind: 'directive-output';
}
