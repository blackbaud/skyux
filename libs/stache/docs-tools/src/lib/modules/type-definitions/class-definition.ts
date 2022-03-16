import { SkyDocsEntryDefinition } from './entry-definition';
import { SkyDocsClassMethodDefinition } from './method-definition';
import { SkyDocsClassPropertyDefinition } from './property-definition';

/**
 * Describes classes and services.
 */
export interface SkyDocsClassDefinition extends SkyDocsEntryDefinition {
  methods?: SkyDocsClassMethodDefinition[];

  properties?: SkyDocsClassPropertyDefinition[];
}
