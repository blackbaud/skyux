import { SkyDocsEntryDefinition } from './entry-definition';

import { SkyDocsTypeDefinition } from './type-definition';

import { SkyDocsTypeParameterDefinition } from './type-parameter-definition';

/**
 * Describes type aliases.
 */
export interface SkyDocsTypeAliasDefinition extends SkyDocsEntryDefinition {
  type: SkyDocsTypeDefinition;

  typeParameters?: SkyDocsTypeParameterDefinition[];
}
