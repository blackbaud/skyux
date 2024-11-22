import type {
  SkyManifestChildDefinition,
  SkyManifestJsDocDefinition,
  SkyManifestParentDefinition,
} from './base-def';
import { SkyManifestParameterDefinition } from './function-def';

/**
 * Information about an interface exported from the public API.
 */
export interface SkyManifestInterfaceDefinition
  extends SkyManifestParentDefinition {
  kind: 'interface';
  indexSignatures?: SkyManifestIndexSignatureDefinition[];
  children?: SkyManifestInterfacePropertyDefinition[];
}

/**
 * Information about an interface exported from the public API.
 */
export interface SkyManifestInterfacePropertyDefinition
  extends SkyManifestChildDefinition {
  isOptional?: boolean;
  kind: 'interface-property';
}

/**
 * Information about an object's index signature.
 */
export interface SkyManifestIndexSignatureDefinition
  extends SkyManifestJsDocDefinition {
  name: string;
  parameters: SkyManifestParameterDefinition[];
  type: string;
  kind: 'index-signature';
}
