interface SkyManifestJSDocsDefinition {
  codeExample?: string;
  isDeprecated?: boolean;
  isPreview?: boolean;
  deprecationReason?: string;
  description?: string;
}

/**
 * Describes function and method parameters.
 */
interface SkyManifestParameterDefinition {
  defaultValue?: string;
  description?: string;
  isRequired?: boolean;
  name: string;
  type: SkyManifestTypeDefinition;
  typeArguments?: SkyManifestTypeDefinition[];
}

/**
 * Used by method, function, and arrow function types.
 */
interface SkyManifestCallSignatureDefinition {
  parameters?: SkyManifestParameterDefinition[];
  returnType: SkyManifestTypeDefinition;
}

/**
 * Describes index signature types, e.g. `[_: string]: unknown`.
 */
interface SkyManifestIndexSignatureDefinition {
  key: {
    name: string;
    type: SkyManifestTypeDefinition;
  };
  type: SkyManifestTypeDefinition;
}

/**
 * Describes interface properties.
 */
export interface SkyManifestInterfacePropertyDefinition
  extends SkyManifestJSDocsDefinition {
  isRequired?: boolean;
}

/**
 * Describes TypeScript types.
 */
interface SkyManifestTypeDefinition {
  callSignature?: SkyManifestCallSignatureDefinition;
  indexSignature?: SkyManifestIndexSignatureDefinition;
  name: string;
  type?:
    | 'array'
    | 'intrinsic'
    | 'literal'
    | 'reference'
    | 'reflection'
    | 'typeParameter'
    | 'typeOperator'
    | 'union'
    | 'unknown';
  /**
   * Describes any type arguments, e.g. `<T, F>`.
   */
  typeArguments?: SkyManifestTypeDefinition[];
  /**
   * Used for type literals or inline interfaces, e.g. `route: { commands: any[] }`
   */
  typeLiteral?: {
    properties?: SkyManifestInterfacePropertyDefinition[];
  };
  /**
   * The types that compose a union type.
   */
  unionTypes?: SkyManifestTypeDefinition[];
}

/**
 * e.g. Foo<T>()
 */
interface SkyManifestTypeParameterDefinition {
  name: string;
  type?: SkyManifestTypeDefinition;
}

interface SkyManifestClassMethodDefinition extends SkyManifestJSDocsDefinition {
  isStatic?: boolean;
  name: string;
  type: SkyManifestTypeDefinition;
  typeParameters?: SkyManifestTypeParameterDefinition[];
}

interface SkyManifestClassPropertyDefinition
  extends SkyManifestJSDocsDefinition {
  defaultValue?: string;
  isRequired?: boolean;
  type: SkyManifestTypeDefinition;
}

interface SkyManifestClassDefinition extends SkyManifestJSDocsDefinition {
  methods?: SkyManifestClassMethodDefinition[];
  properties?: SkyManifestClassPropertyDefinition[];
}

interface SkyManifestDirectiveDefinition extends SkyManifestJSDocsDefinition {
  inputs?: SkyManifestClassPropertyDefinition[];
  outputs?: SkyManifestClassPropertyDefinition[];
  selector: string;
}

interface SkyManifestEnumerationMemberDefinition
  extends SkyManifestJSDocsDefinition {
  name: string;
}

interface SkyManifestEnumerationDefinition extends SkyManifestJSDocsDefinition {
  members: SkyManifestEnumerationMemberDefinition[];
}

interface SkyManifestInterfaceDefinition extends SkyManifestJSDocsDefinition {
  properties: SkyManifestInterfacePropertyDefinition[];
  typeParameters?: SkyManifestTypeParameterDefinition[];
}

interface SkyManifestPipeDefinition extends SkyManifestJSDocsDefinition {
  transformMethod: SkyManifestClassMethodDefinition;
}

interface SkyManifestTypeAliasDefinition extends SkyManifestJSDocsDefinition {
  type: SkyManifestTypeDefinition;
  typeParameters?: SkyManifestTypeParameterDefinition[];
}

/**
 *
 */
export interface SkyManifest {
  publicApi: {
    packages: Record<
      string,
      {
        modules: Record<
          string,
          {
            classes: SkyManifestClassDefinition[];
            components: SkyManifestDirectiveDefinition[];
            directives: SkyManifestDirectiveDefinition[];
            enumerations: SkyManifestEnumerationDefinition[];
            interfaces: SkyManifestInterfaceDefinition[];
            modules: SkyManifestClassDefinition[];
            pipes: SkyManifestPipeDefinition[];
            services: SkyManifestClassDefinition[];
            typeAliases: SkyManifestTypeAliasDefinition[];
          }
        >;
      }
    >;
  };
}
