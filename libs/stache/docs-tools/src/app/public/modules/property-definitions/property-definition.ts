import {
  TemplateRef
} from '@angular/core';

export interface SkyPropertyDefinition {
  dataType: string;
  defaultValue: string;
  isRequired: boolean;
  propertyName: string;
  templateRef?: TemplateRef<any>;
}
