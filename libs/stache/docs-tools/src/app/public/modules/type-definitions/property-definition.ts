import {
  TemplateRef
} from '@angular/core';

export interface SkyPropertyDefinition {

  /**
   * The value type of the property.
   */
  propertyType: string;

  /**
   * The default value of the property.
   */
  defaultValue: string;

  description?: string;

  deprecationWarning: string;

  propertyDecorator: 'Input' | 'Output';

  propertyName: string;

  templateRef: TemplateRef<any>;

}
