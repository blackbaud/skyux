import {
  TemplateRef
} from '@angular/core';

import {
  SkyDocsPropertyDecorator
} from './property-decorator';

export interface SkyDocsPropertyDefinition {

  name: string;

  type: string;

  decorator?: SkyDocsPropertyDecorator;

  defaultValue?: string;

  deprecationWarning?: string;

  description?: string;

  isOptional?: boolean;

  templateRef?: TemplateRef<any>;
}
