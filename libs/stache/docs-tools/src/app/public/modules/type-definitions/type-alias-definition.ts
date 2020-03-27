import {
  SkyDocsParameterDefinition
} from './parameter-definition';

export interface SkyDocsTypeAliasDefinition {

  name: string;

  anchorId?: string;

  description?: string;

}

export interface SkyDocsTypeAliasFunctionDefinition extends SkyDocsTypeAliasDefinition {

  returnType: string;

  parameters?: SkyDocsParameterDefinition[];

}

export interface SkyDocsTypeAliasIndexSignatureDefinition extends SkyDocsTypeAliasDefinition {

  keyName: string;

  valueType: string;

}

export interface SkyDocsTypeAliasUnionDefinition extends SkyDocsTypeAliasDefinition {

  types: string[];

}
