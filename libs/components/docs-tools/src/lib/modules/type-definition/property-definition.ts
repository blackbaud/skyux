import type {
  SkyManifestClassPropertyDefinition,
  SkyManifestDirectiveInputDefinition,
  SkyManifestDirectiveOutputDefinition,
  SkyManifestEnumerationMemberDefinition,
  SkyManifestInterfacePropertyDefinition,
} from '@skyux/manifest';

/**
 * @internal
 */
export type PropertyDefinition =
  | SkyManifestClassPropertyDefinition
  | SkyManifestInterfacePropertyDefinition
  | SkyManifestEnumerationMemberDefinition
  | SkyManifestDirectiveInputDefinition
  | SkyManifestDirectiveOutputDefinition;
