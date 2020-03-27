import {
  SkyDocsParameterDefinition
} from './parameter-definition';

export interface SkyDocsMethodDefinition {

  name: string;

  codeExample?: string;

  codeExampleLanguage?: string;

  description?: string;

  deprecationWarning?: string;

  parameters?: SkyDocsParameterDefinition[];

  returnType?: string;

  typeParameters?: string[];

}
