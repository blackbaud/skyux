import type {
  SkyManifestChildDefinition,
  SkyManifestParentDefinition,
} from './base-def';
import type { SkyManifestParameterDefinition } from './function-def';

/**
 * Information about a class exported from the public API.
 */
export interface SkyManifestClassDefinition
  extends SkyManifestParentDefinition {
  children?: (
    | SkyManifestClassMethodDefinition
    | SkyManifestClassPropertyDefinition
  )[];
  kind: 'class' | 'module' | 'service';
}

/**
 * Information about a class method.
 */
export interface SkyManifestClassMethodDefinition
  extends SkyManifestChildDefinition {
  isStatic?: boolean;
  parameters: SkyManifestParameterDefinition[];
  kind: 'class-method';
}

/**
 * Information about a class property.
 */
export interface SkyManifestClassPropertyDefinition
  extends SkyManifestChildDefinition {
  defaultValue?: string;
  kind: 'class-property';
}
