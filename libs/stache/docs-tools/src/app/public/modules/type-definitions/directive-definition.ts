import {
  SkyDocsClassPropertyDefinition
} from './property-definition';

import {
  SkyDocsEntryDefinition
} from './entry-definition';

/**
 * Describes components and directives.
 */
export interface SkyDocsDirectiveDefinition extends SkyDocsEntryDefinition {

  eventProperties?: SkyDocsClassPropertyDefinition[];

  inputProperties?: SkyDocsClassPropertyDefinition[];

  selector: string;

}
