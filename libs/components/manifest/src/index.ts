export { getDeprecatedTemplateFeatures } from './get-deprecated-template-features';
export type {
  SkyManifestClassDefinition,
  SkyManifestClassMethodDefinition,
  SkyManifestClassPropertyDefinition,
  SkyManifestDefinition,
  SkyManifestDefinitionKind,
  SkyManifestDirectiveDefinition,
  SkyManifestDirectiveInputDefinition,
  SkyManifestEnumerationDefinition,
  SkyManifestEnumerationMemberDefinition,
  SkyManifestFunctionDefinition,
  SkyManifestIndexSignatureDefinition,
  SkyManifestInterfaceDefinition,
  SkyManifestInterfacePropertyDefinition,
  SkyManifestParameterDefinition,
  SkyManifestPipeDefinition,
  SkyManifestPublicApi,
  SkyManifestTypeAliasDefinition,
  SkyManifestVariableDefinition,
} from './types/manifest.js';
export {
  isDirectiveDefinition,
  isPipeDefinition,
  isTemplateFeature,
} from './utils';
export type {
  SkyManifestDeprecatedDirective,
  SkyManifestDeprecatedPipe,
  SkyManifestTemplateFeatureDeprecations,
} from './types/deprecated';
