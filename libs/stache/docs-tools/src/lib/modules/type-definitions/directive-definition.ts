import { SkyDocsEntryDefinition } from './entry-definition';
import { SkyDocsClassPropertyDefinition } from './property-definition';

/**
 * Describes components and directives.
 */
export interface SkyDocsDirectiveDefinition extends SkyDocsEntryDefinition {
  eventProperties?: SkyDocsClassPropertyDefinition[];

  inputProperties?: SkyDocsClassPropertyDefinition[];

  selector: string;
}
