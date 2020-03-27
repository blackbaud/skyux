import {
  SkyDocsPropertyDefinition
} from './property-definition';

export interface SkyDocsParameterDefinition extends SkyDocsPropertyDefinition {

  isOptional: boolean;

  defaultValue?: string;

}
