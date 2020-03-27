import {
  SkyDocsParameterDefinition
} from './parameter-definition';

export interface SkyDocsPipeDefinition {

  inputValue: {
    description: string;
    name: string;
    type: string;
  };

  name: string;

  anchorId?: string;

  codeExample?: string;

  codeExampleLanguage?: string;

  description?: string;

  parameters?: SkyDocsParameterDefinition[];

}
