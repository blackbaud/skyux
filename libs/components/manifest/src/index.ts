// export { getDeprecatedTemplateFeatures } from './get-deprecated-template-features';
export type {
  SkyManifestChildDefinition,
  SkyManifestChildDefinitionKind,
  SkyManifestCodeExampleLanguage,
  SkyManifestParentDefinition,
  SkyManifestParentDefinitionKind,
} from './types/base-def';
export type {
  SkyManifestClassDefinition,
  SkyManifestClassMethodDefinition,
  SkyManifestClassPropertyDefinition,
} from './types/class-def';
export type {
  SkyManifestDirectiveDefinition,
  SkyManifestDirectiveInputDefinition,
} from './types/directive-def';
export type {
  SkyManifestEnumerationDefinition,
  SkyManifestEnumerationMemberDefinition,
} from './types/enumeration-def';
export type {
  SkyManifestFunctionDefinition,
  SkyManifestParameterDefinition,
} from './types/function-def';
export type {
  SkyManifestIndexSignatureDefinition,
  SkyManifestInterfaceDefinition,
  SkyManifestInterfacePropertyDefinition,
} from './types/interface-def';
export type { SkyManifestPipeDefinition } from './types/pipe-def';
export type { SkyManifestTypeAliasDefinition } from './types/type-alias-def';
export type { SkyManifestVariableDefinition } from './types/variable-def';
export type { SkyManifestPublicApi } from './types/manifest.js';
export { isDirectiveDefinition } from './utils';
// export type {
//   SkyManifestDeprecatedDirective,
//   SkyManifestDeprecatedPipe,
//   SkyManifestTemplateFeatureDeprecations,
// } from './types/_deprecated';
