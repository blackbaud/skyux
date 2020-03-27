import {
  SkyDocsMethodDefinition
} from './method-definition';

import {
  SkyDocsPropertyDefinition
} from './property-definition';

export interface SkyDocsClassDefinition {

  name: string;

  anchorId?: string;

  description?: string;

  methods?: SkyDocsMethodDefinition[];

  properties?: SkyDocsPropertyDefinition[];

}
