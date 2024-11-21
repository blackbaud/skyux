/**
 * The kind of entity exported from the public API.
 */
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

/**
 * Information about a class exported from the public API.
 */
export interface SkyManifestClassDefinition extends SkyManifestDefinition {
  methods: SkyManifestClassMethodDefinition[];
  properties: SkyManifestClassPropertyDefinition[];
}

/**
 * Information about a class method.
 */
export interface SkyManifestClassMethodDefinition
  extends SkyManifestJsDocDefinition {
  isStatic?: boolean;
  name: string;
  parameters: SkyManifestParameterDefinition[];
  returnType: string;
}

/**
 * Information about a class property.
 */
export interface SkyManifestClassPropertyDefinition
  extends SkyManifestJsDocDefinition {
  defaultValue: string;
  name: string;
  type: string;
}

/**
 * Information shared by all entities exported from the public API.
 */
export interface SkyManifestDefinition extends SkyManifestJsDocDefinition {
  anchorId: string;
  filePath: string;
  isInternal: boolean;
  kind: SkyManifestDefinitionKind;
  name: string;
}

/**
 * Information about a directive or component exported from the public API.
 */
export interface SkyManifestDirectiveDefinition extends SkyManifestDefinition {
  inputs: SkyManifestDirectiveInputDefinition[];
  outputs: SkyManifestClassPropertyDefinition[];
  selector: string;
}

/**
 * Information about a directive input property.
 */
export interface SkyManifestDirectiveInputDefinition
  extends SkyManifestClassPropertyDefinition {
  isRequired?: boolean;
}

/**
 * Information about an enumeration exported from the public API.
 */
export interface SkyManifestEnumerationDefinition
  extends SkyManifestDefinition {
  members: SkyManifestEnumerationMemberDefinition[];
}

/**
 * Information about an enumeration member.
 */
export interface SkyManifestEnumerationMemberDefinition
  extends SkyManifestJsDocDefinition {
  name: string;
  type: string;
}

/**
 * Information about a function exported from the public API.
 */
export interface SkyManifestFunctionDefinition extends SkyManifestDefinition {
  parameters: SkyManifestParameterDefinition[];
  returnType: string;
}

/**
 * Information about an object's index signature.
 */
export interface SkyManifestIndexSignatureDefinition
  extends SkyManifestJsDocDefinition {
  name: string;
  parameters: SkyManifestParameterDefinition[];
  type: string;
}

/**
 * Information about an interface exported from the public API.
 */
export interface SkyManifestInterfaceDefinition extends SkyManifestDefinition {
  indexSignatures: SkyManifestIndexSignatureDefinition[];
  properties: SkyManifestInterfacePropertyDefinition[];
}

/**
 * Information about an interface exported from the public API.
 */
export interface SkyManifestInterfacePropertyDefinition
  extends SkyManifestJsDocDefinition {
  isOptional?: boolean;
  name: string;
  type: string;
}

/**
 * Information captured from common JSDoc comments.
 */
export interface SkyManifestJsDocDefinition {
  codeExample: string;
  codeExampleLanguage: 'markup' | 'typescript';
  deprecationReason: string;
  description: string;
  isDeprecated: boolean;
  isPreview: boolean;
}

/**
 * Information about a function or method parameter.
 */
export interface SkyManifestParameterDefinition {
  defaultValue: string;
  description: string;
  isOptional?: boolean;
  name: string;
  type: string;
}

/**
 * Information about a pipe exported from the public API.
 */
export interface SkyManifestPipeDefinition extends SkyManifestDefinition {
  transformMethod: SkyManifestClassMethodDefinition;
}

/**
 * Information about the SKY UX public API.
 */
export interface SkyManifestPublicApi {
  packages: Record<string, SkyManifestDefinition[]>;
}

/**
 * Information about a type alias exported from the public API.
 */
export interface SkyManifestTypeAliasDefinition extends SkyManifestDefinition {
  type: string;
}

/**
 * Information about a variable exported from the public API.
 */
export interface SkyManifestVariableDefinition extends SkyManifestDefinition {
  type: string;
}
