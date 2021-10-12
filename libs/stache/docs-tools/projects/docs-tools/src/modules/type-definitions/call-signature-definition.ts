import {
  SkyDocsParameterDefinition
} from './parameter-definition';

import {
  SkyDocsTypeDefinition
} from './type-definition';

/**
 * Describes methods, functions, and inline arrow functions.
 */
export interface SkyDocsCallSignatureDefinition {

  parameters?: SkyDocsParameterDefinition[];

  returnType: SkyDocsTypeDefinition;

}
