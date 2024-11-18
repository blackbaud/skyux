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

// /**
//  * Describes interface properties.
//  */
// export interface SkyManifestInterfacePropertyDefinition
//   extends SkyManifestJSDocsDefinition {
//   isRequired: boolean;
// }

/**
 * Describes TypeScript types.
 */
// export interface SkyManifestTypeDefinition {
//   callSignature?: SkyManifestCallSignatureDefinition;
//   indexSignature?: SkyManifestIndexSignatureDefinition;
//   name?: string;
//   type?:
//     | 'array'
//     | 'intrinsic'
//     | 'literal'
//     | 'reference'
//     | 'reflection'
//     | 'typeParameter'
//     | 'typeOperator'
//     | 'union'
//     | 'unknown';
//   /**
//    * Describes any type arguments, e.g. `<T, F>`.
//    */
//   typeArguments?: SkyManifestTypeDefinition[];
//   /**
//    * Used for type literals or inline interfaces, e.g. `route: { commands: any[] }`
//    */
//   typeLiteral?: {
//     properties: SkyManifestInterfacePropertyDefinition[];
//   };
//   /**
//    * The types that compose a union type.
//    */
//   unionTypes?: SkyManifestTypeDefinition[];
// }

/**
 * e.g. Foo<T>()
 */
// export interface SkyManifestTypeParameterDefinition {
//   name: string;
//   type: string;
// }

export interface SkyManifestFunctionOrMethodDefinition
  extends SkyManifestJSDocsDefinition {
  name: string;
  parameters: SkyManifestParameterDefinition[];
  returnType: string;
}

export interface SkyManifestClassPropertyDefinition
  extends SkyManifestJSDocsDefinition {
  defaultValue: string;
  isOptional: boolean;
  name: string;
  type: string;
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
  extends SkyManifestJSDocsDefinition {
  methods: SkyManifestFunctionOrMethodDefinition[];
  name: string;
  properties: SkyManifestClassPropertyDefinition[];
}

// export interface SkyManifestDirectiveInputDefinition
//   extends SkyManifestJSDocsDefinition {
//   defaultValue: string;
//   isRequired: boolean;
//   name: string;
//   type: string;
// }

export interface SkyManifestDirectiveDefinition
  extends SkyManifestJSDocsDefinition {
  inputs: SkyManifestClassPropertyDefinition[];
  outputs: SkyManifestClassPropertyDefinition[];
  selector: string;
}

export interface SkyManifestEnumerationMemberDefinition
  extends SkyManifestJSDocsDefinition {
  name: string;
  type: string;
}

export interface SkyManifestEnumerationDefinition
  extends SkyManifestJSDocsDefinition {
  members: SkyManifestEnumerationMemberDefinition[];
}

export interface SkyManifestInterfaceDefinition
  extends SkyManifestJSDocsDefinition {
  name: string;
  properties: SkyManifestInterfacePropertyDefinition[];
  indexSignatures: SkyManifestIndexSignatureDefinition[];
}

export interface SkyManifestPipeDefinition extends SkyManifestJSDocsDefinition {
  transformMethod: SkyManifestFunctionOrMethodDefinition;
}

export interface SkyManifestTypeAliasDefinition
  extends SkyManifestJSDocsDefinition {
  name: string;
  type: string;
}

export interface SkyManifestVariableDefinition
  extends SkyManifestJSDocsDefinition {
  name: string;
  type: string;
}

export interface SkyManifestPackage {
  classes: SkyManifestClassDefinition[];
  components: SkyManifestDirectiveDefinition[];
  directives: SkyManifestDirectiveDefinition[];
  enumerations: SkyManifestEnumerationDefinition[];
  functions: SkyManifestFunctionOrMethodDefinition[];
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
  packages: SkyManifestPackages;
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
