import { SkyDocsTypeDefinition } from './type-definition';

/**
 * Describes index signature types, e.g. `[_: string]: any`.
 */
export interface SkyDocsIndexSignatureDefinition {
  key: {
    name: string;
    type: SkyDocsTypeDefinition;
  };

  type: SkyDocsTypeDefinition;
}
