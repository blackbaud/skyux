interface SkyMetadataJSDocsDefinition {
  codeExample?: string;
  isDeprecated?: boolean;
  isPreview?: boolean;
  deprecationReason?: string;
  description?: string;
}

/**
 * Describes function and method parameters.
 */
interface SkyMetadataParameterDefinition {
  defaultValue?: string;
  description?: string;
  isRequired?: boolean;
  name: string;
  type: SkyMetadataTypeDefinition;
  typeArguments?: SkyMetadataTypeDefinition[];
}

/**
 * Used by method, function, and arrow function types.
 */
interface SkyMetadataCallSignatureDefinition {
  parameters?: SkyMetadataParameterDefinition[];
  returnType: SkyMetadataTypeDefinition;
}

/**
 * Describes index signature types, e.g. `[_: string]: unknown`.
 */
interface SkyMetadataIndexSignatureDefinition {
  key: {
    name: string;
    type: SkyMetadataTypeDefinition;
  };
  type: SkyMetadataTypeDefinition;
}

/**
 * Describes interface properties.
 */
export interface SkyMetadataInterfacePropertyDefinition
  extends SkyMetadataJSDocsDefinition {
  isRequired?: boolean;
}

/**
 * Describes TypeScript types.
 */
interface SkyMetadataTypeDefinition {
  callSignature?: SkyMetadataCallSignatureDefinition;
  indexSignature?: SkyMetadataIndexSignatureDefinition;
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
  typeArguments?: SkyMetadataTypeDefinition[];
  /**
   * Used for type literals or inline interfaces, e.g. `route: { commands: any[] }`
   */
  typeLiteral?: {
    properties?: SkyMetadataInterfacePropertyDefinition[];
  };
  /**
   * The types that compose a union type.
   */
  unionTypes?: SkyMetadataTypeDefinition[];
}

/**
 * e.g. Foo<T>()
 */
interface SkyMetadataTypeParameterDefinition {
  name: string;
  type?: SkyMetadataTypeDefinition;
}

interface SkyMetadataClassMethodDefinition extends SkyMetadataJSDocsDefinition {
  isStatic?: boolean;
  name: string;
  type: SkyMetadataTypeDefinition;
  typeParameters?: SkyMetadataTypeParameterDefinition[];
}

interface SkyMetadataClassPropertyDefinition
  extends SkyMetadataJSDocsDefinition {
  defaultValue?: string;
  isRequired?: boolean;
  type: SkyMetadataTypeDefinition;
}

interface SkyMetadataClassDefinition extends SkyMetadataJSDocsDefinition {
  methods?: SkyMetadataClassMethodDefinition[];
  properties?: SkyMetadataClassPropertyDefinition[];
}

interface SkyMetadataDirectiveDefinition extends SkyMetadataJSDocsDefinition {
  inputs?: SkyMetadataClassPropertyDefinition[];
  outputs?: SkyMetadataClassPropertyDefinition[];
  selector: string;
}

interface SkyMetadataEnumerationMemberDefinition
  extends SkyMetadataJSDocsDefinition {
  name: string;
}

interface SkyMetadataEnumerationDefinition extends SkyMetadataJSDocsDefinition {
  members: SkyMetadataEnumerationMemberDefinition[];
}

interface SkyMetadataInterfaceDefinition extends SkyMetadataJSDocsDefinition {
  properties: SkyMetadataInterfacePropertyDefinition[];
  typeParameters?: SkyMetadataTypeParameterDefinition[];
}

interface SkyMetadataPipeDefinition extends SkyMetadataJSDocsDefinition {
  transformMethod: SkyMetadataClassMethodDefinition;
}

interface SkyMetadataTypeAliasDefinition extends SkyMetadataJSDocsDefinition {
  type: SkyMetadataTypeDefinition;
  typeParameters?: SkyMetadataTypeParameterDefinition[];
}

/**
 *
 */
export interface SkyMetadata {
  publicApi: {
    packages: Record<
      string,
      {
        modules: Record<
          string,
          {
            classes: SkyMetadataClassDefinition[];
            components: SkyMetadataDirectiveDefinition[];
            directives: SkyMetadataDirectiveDefinition[];
            enumerations: SkyMetadataEnumerationDefinition[];
            interfaces: SkyMetadataInterfaceDefinition[];
            modules: SkyMetadataClassDefinition[];
            pipes: SkyMetadataPipeDefinition[];
            services: SkyMetadataClassDefinition[];
            typeAliases: SkyMetadataTypeAliasDefinition[];
          }
        >;
      }
    >;
  };
}
