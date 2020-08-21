import {
  SkyDocsParameterDefinition
} from './parameter-definition';

import {
  SkyDocsTypeDefinition
} from './type-definition';

export interface SkyDocsMethodDefinition {

  name: string;

  codeExample?: string;

  codeExampleLanguage?: string;

  description?: string;

  deprecationWarning?: string;

  parameters?: SkyDocsParameterDefinition[];

  returnType?: SkyDocsTypeDefinition;

  typeParameters?: string[];

}
