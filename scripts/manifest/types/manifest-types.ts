export type SkyManifestDefinitionKind =
  | 'class'
  | 'component'
  | 'directive'
  | 'enumeration'
  | 'function'
  | 'interface'
  | 'module'
  | 'pipe'
  | 'service'
  | 'type-alias'
  | 'variable';

export interface SkyManifestDefinition extends SkyManifestJsDocDefinition {
  anchorId: string;
  filePath: string;
  kind: SkyManifestDefinitionKind;
  isInternal: boolean;
  name: string;
}

export interface SkyManifestJsDocDefinition {
  codeExample: string;
  codeExampleLanguage: 'markup' | 'typescript';
  isDeprecated: boolean;
  isPreview: boolean;
  deprecationReason: string;
  description: string;
}

export interface SkyManifestParameterDefinition {
  defaultValue: string;
  description: string;
  isOptional: boolean;
  name: string;
  type: string;
}

export interface SkyManifestFunctionDefinition extends SkyManifestDefinition {
  parameters: SkyManifestParameterDefinition[];
  returnType: string;
}

export interface SkyManifestClassMethodDefinition
  extends SkyManifestJsDocDefinition {
  isStatic: boolean;
  name: string;
  parameters: SkyManifestParameterDefinition[];
  returnType: string;
}

export interface SkyManifestClassPropertyDefinition
  extends SkyManifestJsDocDefinition {
  defaultValue: string;
  name: string;
  type: string;
}

export interface SkyManifestDirectiveInputDefinition
  extends SkyManifestClassPropertyDefinition {
  isRequired: boolean;
}

export interface SkyManifestInterfacePropertyDefinition
  extends SkyManifestJsDocDefinition {
  isOptional: boolean;
  name: string;
  type: string;
}

export interface SkyManifestIndexSignatureDefinition
  extends SkyManifestJsDocDefinition {
  name: string;
  type: string;
  parameters: SkyManifestParameterDefinition[];
}

export interface SkyManifestClassDefinition extends SkyManifestDefinition {
  methods: SkyManifestClassMethodDefinition[];
  properties: SkyManifestClassPropertyDefinition[];
}

export interface SkyManifestDirectiveDefinition extends SkyManifestDefinition {
  inputs: SkyManifestDirectiveInputDefinition[];
  outputs: SkyManifestClassPropertyDefinition[];
  selector: string;
}

export interface SkyManifestEnumerationMemberDefinition
  extends SkyManifestJsDocDefinition {
  name: string;
  type: string;
}

export interface SkyManifestEnumerationDefinition
  extends SkyManifestDefinition {
  members: SkyManifestEnumerationMemberDefinition[];
}

export interface SkyManifestInterfaceDefinition extends SkyManifestDefinition {
  properties: SkyManifestInterfacePropertyDefinition[];
  indexSignatures: SkyManifestIndexSignatureDefinition[];
}

export interface SkyManifestPipeDefinition extends SkyManifestDefinition {
  transformMethod: SkyManifestClassMethodDefinition;
}

export interface SkyManifestTypeAliasDefinition extends SkyManifestDefinition {
  type: string;
}

export interface SkyManifestVariableDefinition extends SkyManifestDefinition {
  type: string;
}

// export type SkyManifestPackage = Record<string, SkyManifestPackageSection>;

// export interface SkyManifestPackageSection {
//   classes: SkyManifestClassDefinition[];
//   components: SkyManifestDirectiveDefinition[];
//   directives: SkyManifestDirectiveDefinition[];
//   enumerations: SkyManifestEnumerationDefinition[];
//   functions: SkyManifestFunctionDefinition[];
//   interfaces: SkyManifestInterfaceDefinition[];
//   modules: SkyManifestClassDefinition[];
//   pipes: SkyManifestPipeDefinition[];
//   services: SkyManifestClassDefinition[];
//   typeAliases: SkyManifestTypeAliasDefinition[];
//   variables: SkyManifestVariableDefinition[];
// }

/**
 * packages.get('@skyux/core:foo')
 */

// export type SkyManifestPackages = Record<string, SkyManifestPackage>;

// export type SkyManifestTemplateFeatures = {
//   packages: Record<string, SkyManifestTemplateFeaturesPackage>;
// };

// export interface SkyManifestTemplateFeaturesPackage {
//   directives: {
//     selector: string;
//     inputs: string[];
//     outputs: string[];
//   }[];
//   pipes: {
//     name: string;
//   }[];
// }

/**
 * Input: [subject]="@skyux/indicators:help-inline"
 * Lookup: publicApi.packages['@skyux/indicators:help-inline']
 */
// export interface SkyManifest {
// publicApi: SkyManifestPackages;
// deprecated: unknown;
// templateFeatures: SkyManifestTemplateFeatures;
// }
