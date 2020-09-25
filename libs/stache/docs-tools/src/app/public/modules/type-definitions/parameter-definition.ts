import {
  SkyDocsTypeDefinition
} from './type-definition';

/**
 * Describes function and method parameters.
 */
export interface SkyDocsParameterDefinition {

  defaultValue?: string;

  description?: string;

  isOptional: boolean;

  name: string;

  type: SkyDocsTypeDefinition;

  typeArguments?: SkyDocsTypeDefinition[];

}
