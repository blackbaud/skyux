import type { SkyManifestParentDefinition } from './base-def';

/**
 * Information about a function exported from the public API.
 */
export interface SkyManifestFunctionDefinition
  extends SkyManifestParentDefinition {
  kind: 'function';
  parameters: SkyManifestParameterDefinition[];
  type: string;
  typeParameters?: string;
}

/**
 * Information about a function or method parameter.
 */
export interface SkyManifestParameterDefinition {
  defaultValue?: string;
  description?: string;
  isOptional?: boolean;
  name: string;
  type: string;
}
