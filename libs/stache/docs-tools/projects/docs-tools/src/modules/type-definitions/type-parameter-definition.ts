import {
  SkyDocsTypeDefinition
} from './type-definition';

/**
 * Describes a type parameter, e.g. `<T>`.
 */
export interface SkyDocsTypeParameterDefinition {

  name: string;

  type?: SkyDocsTypeDefinition;

}
