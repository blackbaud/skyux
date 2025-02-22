import type {
  SkyManifestClassPropertyDefinition,
  SkyManifestDirectiveInputDefinition,
  SkyManifestDirectiveOutputDefinition,
  SkyManifestEnumerationMemberDefinition,
  SkyManifestInterfacePropertyDefinition,
} from '@skyux/manifest';

// TODO: Make this an export of Manifest?
export type PropertyDefinition =
  | SkyManifestClassPropertyDefinition
  | SkyManifestInterfacePropertyDefinition
  | SkyManifestEnumerationMemberDefinition
  | SkyManifestDirectiveInputDefinition
  | SkyManifestDirectiveOutputDefinition;
