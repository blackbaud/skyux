import {
  TemplateRef
} from '@angular/core';

import {
  SkyDocsPropertyDecorator
} from './property-decorator';

import {
  SkyDocsTypeDefinition
} from './type-definition';

export interface SkyDocsPropertyDefinition {

  name: string;

  type: SkyDocsTypeDefinition;

  decorator?: SkyDocsPropertyDecorator;

  defaultValue?: string;

  deprecationWarning?: string;

  description?: string;

  isOptional?: boolean;

  templateRef?: TemplateRef<any>;
}
