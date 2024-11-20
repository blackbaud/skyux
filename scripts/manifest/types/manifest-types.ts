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

export interface SkyManifestTopLevelDefinition
  extends SkyManifestJSDocsDefinition {
  anchorId: string;
  kind: SkyManifestDefinitionKind;
  name: string;
}

export interface SkyManifestJSDocsDefinition {
  codeExample: string;
  codeExampleLanguage: 'markup' | 'typescript';
  isDeprecated: boolean;
  isPreview: boolean;
  deprecationReason: string;
  description: string;
}

/**
 * Describes function and method parameters.
 */
export interface SkyManifestParameterDefinition {
  defaultValue: string;
  description: string;
  isOptional: boolean;
  name: string;
  type: string;
}

export interface SkyManifestFunctionDefinition
  extends SkyManifestTopLevelDefinition {
  parameters: SkyManifestParameterDefinition[];
  returnType: string;
}

export interface SkyManifestClassMethodDefinition
  extends SkyManifestJSDocsDefinition {
  isStatic: boolean;
  name: string;
  parameters: SkyManifestParameterDefinition[];
  returnType: string;
}

export interface SkyManifestClassPropertyDefinition
  extends SkyManifestJSDocsDefinition {
  defaultValue: string;
  name: string;
  type: string;
}

export interface SkyManifestDirectiveInputDefinition
  extends SkyManifestClassPropertyDefinition {
  isRequired: boolean;
}

export interface SkyManifestInterfacePropertyDefinition
  extends SkyManifestJSDocsDefinition {
  isOptional: boolean;
  name: string;
  type: string;
}

export interface SkyManifestIndexSignatureDefinition
  extends SkyManifestJSDocsDefinition {
  name: string;
  type: string;
  parameters: SkyManifestParameterDefinition[];
}

export interface SkyManifestClassDefinition
  extends SkyManifestTopLevelDefinition {
  methods: SkyManifestClassMethodDefinition[];
  properties: SkyManifestClassPropertyDefinition[];
}

export interface SkyManifestDirectiveDefinition
  extends SkyManifestTopLevelDefinition {
  inputs: SkyManifestDirectiveInputDefinition[];
  outputs: SkyManifestClassPropertyDefinition[];
  selector: string;
}

export interface SkyManifestEnumerationMemberDefinition
  extends SkyManifestJSDocsDefinition {
  name: string;
  type: string;
}

export interface SkyManifestEnumerationDefinition
  extends SkyManifestTopLevelDefinition {
  members: SkyManifestEnumerationMemberDefinition[];
}

export interface SkyManifestInterfaceDefinition
  extends SkyManifestTopLevelDefinition {
  properties: SkyManifestInterfacePropertyDefinition[];
  indexSignatures: SkyManifestIndexSignatureDefinition[];
}

export interface SkyManifestPipeDefinition
  extends SkyManifestTopLevelDefinition {
  transformMethod: SkyManifestClassMethodDefinition;
}

export interface SkyManifestTypeAliasDefinition
  extends SkyManifestTopLevelDefinition {
  type: string;
}

export interface SkyManifestVariableDefinition
  extends SkyManifestTopLevelDefinition {
  type: string;
}

export type SkyManifestPackage = Record<string, SkyManifestPackageSection>;

export interface SkyManifestPackageSection {
  classes: SkyManifestClassDefinition[];
  components: SkyManifestDirectiveDefinition[];
  directives: SkyManifestDirectiveDefinition[];
  enumerations: SkyManifestEnumerationDefinition[];
  functions: SkyManifestFunctionDefinition[];
  interfaces: SkyManifestInterfaceDefinition[];
  modules: SkyManifestClassDefinition[];
  pipes: SkyManifestPipeDefinition[];
  services: SkyManifestClassDefinition[];
  typeAliases: SkyManifestTypeAliasDefinition[];
  variables: SkyManifestVariableDefinition[];
}

/**
 * packages.get('@skyux/core:foo')
 */

export type SkyManifestPackages = Record<string, SkyManifestPackage>;

/**
 * Input: [subject]="@skyux/indicators:help-inline"
 * Lookup: publicApi.packages['@skyux/indicators:help-inline']
 */
export interface SkyManifest {
  publicApi: SkyManifestPackages;
  deprecated: unknown;
  templateFeatures: {
    packages: Record<
      string,
      {
        directives: {
          selector: string;
          inputs: string[];
          outputs: string[];
        }[];
        pipes: {
          name: string;
        }[];
      }
    >;
  };
}
