import {
  SkyDocsEntryDefinition
} from './entry-definition';

import {
  SkyDocsClassMethodDefinition
} from './method-definition';

/**
 * Describes pipes.
 */
export interface SkyDocsPipeDefinition extends SkyDocsEntryDefinition {

  transformMethod: SkyDocsClassMethodDefinition;

}
