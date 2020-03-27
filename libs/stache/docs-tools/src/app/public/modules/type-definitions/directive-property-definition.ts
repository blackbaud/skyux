import {
  SkyDocsPropertyDecorator
} from './property-decorator';

import {
  SkyDocsPropertyDefinition
} from './property-definition';

export interface SkyDocsDirectivePropertyDefinition extends SkyDocsPropertyDefinition {

  decorator: SkyDocsPropertyDecorator;

  isOptional: boolean;

  defaultValue?: string;

  deprecationWarning?: string;

}
