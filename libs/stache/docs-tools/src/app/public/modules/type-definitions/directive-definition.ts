import {
  SkyDocsDirectivePropertyDefinition
} from './directive-property-definition';

export interface SkyDocsDirectiveDefinition {

  name: string;

  selector: string;

  properties?: SkyDocsDirectivePropertyDefinition[];

  description?: string;

  anchorId?: string;

  codeExample?: string;

  codeExampleLanguage?: string;
}
