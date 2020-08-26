import {
  SkyDocsPropertyDefinition
} from './property-definition';

export interface SkyDocsDirectiveDefinition {

  name: string;

  selector: string;

  properties?: SkyDocsPropertyDefinition[];

  description?: string;

  anchorId?: string;

  codeExample?: string;

  codeExampleLanguage?: string;
}
