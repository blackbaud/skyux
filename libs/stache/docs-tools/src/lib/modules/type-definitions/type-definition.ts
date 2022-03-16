import { SkyDocsCallSignatureDefinition } from './call-signature-definition';

import { SkyDocsIndexSignatureDefinition } from './index-signature-definition';

import { SkyDocsInterfacePropertyDefinition } from './interface-property-definition';

/**
 * Describes TypeScript types.
 */
export interface SkyDocsTypeDefinition {
  /**
   * Used by method, function, and arrow function types.
   */
  callSignature?: SkyDocsCallSignatureDefinition;

  /**
   * Used for index signatures, e.g. `[_: string]: any`
   */
  indexSignature?: SkyDocsIndexSignatureDefinition;

  name?: string;

  type?:
    | 'array'
    | 'intrinsic'
    | 'reference'
    | 'reflection'
    | 'stringLiteral'
    | 'typeParameter'
    | 'typeOperator'
    | 'union'
    | 'unknown';

  /**
   * Describes any type arguments, e.g. `<T, F>`.
   */
  typeArguments?: SkyDocsTypeDefinition[];

  /**
   * Used for type literals or inline interfaces, e.g. `route: { commands: any[] }`
   */
  typeLiteral?: {
    properties?: SkyDocsInterfacePropertyDefinition[];
  };

  /**
   * The types that compose a union type.
   */
  unionTypes?: SkyDocsTypeDefinition[];
}
