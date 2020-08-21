import {
  SkyDocsParameterDefinition
} from './parameter-definition';

export type SkyDocsTypeDefinition = string | {
  callSignature?: {
    parameters?: SkyDocsParameterDefinition[];
    returnType?: SkyDocsTypeDefinition;
  };
};
