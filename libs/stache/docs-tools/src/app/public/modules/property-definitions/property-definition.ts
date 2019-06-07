import {
  TemplateRef
} from '@angular/core';

export interface SkyPropertyDefinition {

  propertyType: string;

  defaultValue: string;

  deprecationWarning: boolean;

  propertyDecorator: 'Input' | 'Output';

  propertyName: string;

  templateRef: TemplateRef<any>;

}
