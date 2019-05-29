import {
  TemplateRef
} from '@angular/core';

export interface SkyPropertyDefinition {

  dataType: string;

  defaultValue: string;

  isDeprecated: boolean;

  isRequired: boolean;

  propertyName: string;

  templateRef?: TemplateRef<any>;

}
